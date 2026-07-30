import { FrameConfig, FrameType } from '@/lib/types';

/**
 * A campaign frame is "visible" if it actually renders something on top of the
 * user's photo. A config can be structurally valid JSON and still produce a
 * completely bare image, which is what happened to somos-200mil-vidas-tzux:
 * type NONE, no imageUrl, no caption, no stickers, no text. Supporters ran their
 * photo through it and got the same photo back.
 *
 * Anything other than NONE draws a ring, so it counts. A NONE frame only counts
 * if it carries an uploaded image, a caption, a sticker, or a text layer.
 */
export function hasVisibleFrame(config: unknown): boolean {
    if (!config || typeof config !== 'object') return false;

    const frame = config as Partial<FrameConfig>;

    // CUSTOM_IMAGE is only meaningful with an actual uploaded image behind it.
    if (frame.type === FrameType.CUSTOM_IMAGE) {
        return typeof frame.imageUrl === 'string' && frame.imageUrl.trim().length > 0;
    }

    // Any real border style draws something on its own.
    if (typeof frame.type === 'string' && frame.type !== FrameType.NONE) {
        return true;
    }

    // type NONE (or missing): only visible if decorated with something else.
    if (typeof frame.imageUrl === 'string' && frame.imageUrl.trim().length > 0) return true;
    if (frame.caption && typeof frame.caption.text === 'string' && frame.caption.text.trim().length > 0) return true;
    if (Array.isArray(frame.stickers) && frame.stickers.length > 0) return true;
    if (Array.isArray(frame.textLayers) && frame.textLayers.length > 0) return true;

    return false;
}

/**
 * SQL mirror of hasVisibleFrame, for filtering campaign lists in the query
 * rather than pulling every row and filtering in JS. Assumes the campaigns
 * table is aliased as `c` unless a different alias is passed.
 *
 * Kept deliberately in step with the function above. If you change one, change both.
 */
export function visibleFrameSql(alias = 'c'): string {
    const cfg = `${alias}.frame_config`;
    return `(
        CASE
            WHEN ${cfg} ->> 'type' = 'CUSTOM_IMAGE'
                THEN COALESCE(NULLIF(TRIM(${cfg} ->> 'imageUrl'), ''), NULL) IS NOT NULL
            WHEN COALESCE(${cfg} ->> 'type', 'NONE') <> 'NONE'
                THEN TRUE
            ELSE (
                COALESCE(NULLIF(TRIM(${cfg} ->> 'imageUrl'), ''), NULL) IS NOT NULL
                OR COALESCE(NULLIF(TRIM(${cfg} -> 'caption' ->> 'text'), ''), NULL) IS NOT NULL
                OR (jsonb_typeof(${cfg} -> 'stickers') = 'array' AND jsonb_array_length(${cfg} -> 'stickers') > 0)
                OR (jsonb_typeof(${cfg} -> 'textLayers') = 'array' AND jsonb_array_length(${cfg} -> 'textLayers') > 0)
            )
        END
    )`;
}

/**
 * How many campaigns feed the home showcase carousel. A spotlight row needs enough
 * cards to actually run off both edges of the screen, so this is deliberately well
 * above the number of campaigns with real traction.
 */
export const HOME_SHOWCASE_LIMIT = 16;

/**
 * Supporter count is only worth showing once it means something. Below this we render
 * no count at all rather than "0 supporting", which reads as dead on a brand new
 * campaign and makes the whole row look abandoned.
 */
export const MIN_SUPPORTERS_TO_DISPLAY = 5;
