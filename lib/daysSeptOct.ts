import type { AwarenessDay } from './days';

/** Sept-Oct awareness + BR/ID local moments. Kept separate so days.ts stays readable. */
export const SEPT_OCT_DAYS: AwarenessDay[] = [
{
        slug: 'suicide-prevention-month',
        name: 'Suicide Prevention Month',
        kind: 'month',
        date: { type: 'month', month: 9 },
        colors: [
            { name: 'Prevention teal', hex: '#14B8A6' },
            { name: 'Awareness purple', hex: '#7C3AED' },
        ],
        category: 'awareness',
        audience: ['Mental health nonprofits', 'Counsellors', 'Schools', 'Universities', 'Community groups'],
        keyword: 'suicide prevention month profile picture frame',
        tagline: 'Make it easier to say the sentence that can be hardest to start.',
        intro: [
            'September is Suicide Prevention Month. The point is not to fill a feed with hopeful slogans; it is to make asking directly, listening calmly, and finding real help feel possible.',
            'A shared teal and purple frame can make that support visible across a school, workplace or community. It should always travel with a crisis resource and a plain invitation to talk.',
        ],
        background: [
            'Suicide Prevention Month is observed throughout September in the United States. World Suicide Prevention Day falls within it on September 10, giving communities a focal date while leaving the rest of the month for training, remembrance and practical conversations.',
            'Teal and purple are widely used together for suicide prevention awareness. The colours are recognisable, but they are not the message by themselves. Useful campaigns tell people what to do next: who they can call, where they can walk in, and how to respond when someone says they are not safe.',
            'In the United States, people can call or text 988 for the Suicide & Crisis Lifeline. Campaigns outside the US need to publish the correct local service rather than copying an American number into a global post.',
        ],
        howToCelebrate: [
            {
                title: 'Save the right number before you need it',
                body: 'Put your local crisis line and one trusted person in your contacts now. In the US, call or text 988. If someone is in immediate danger, contact local emergency services and stay with them if it is safe to do so.',
            },
            {
                title: 'Ask the direct question',
                body: 'If you are worried about someone, asking "are you thinking about suicide?" does not plant the idea. It gives them permission to answer plainly. Listen without arguing, promising secrecy, or rushing to explain why they should feel differently.',
            },
            {
                title: 'Check back after the first conversation',
                body: 'A message the following morning matters. So does another one next week. Support often arrives in a burst when a crisis becomes visible and disappears while the person is still dealing with it.',
            },
            {
                title: 'Learn one practical response',
                body: 'Take a recognised suicide-alertness or mental health first-aid course if one is available locally. A short training is more useful than memorising warning-sign graphics because it lets you practise what to say.',
            },
            {
                title: 'Wear the frame with a resource',
                body: 'Add the frame if you want to make your support visible, but include a crisis line or local service in the post. A colour without a next step leaves the hardest work to the person already struggling.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Publish the route to help',
                body: 'Name the exact office, phone number, opening hours and after-hours option. "Support is available" is not enough when somebody has to search three pages to find it.',
            },
            {
                title: 'Train the people who receive disclosures',
                body: 'Managers, teachers, coaches and front-desk staff are often told first. Give them a clear escalation path and practise it before September rather than handing them a poster after something happens.',
            },
            {
                title: 'Let lived experience lead safely',
                body: 'Invite people to contribute only if they want to, pay them where appropriate, and agree on boundaries before publishing. Avoid graphic detail and do not turn one person\'s survival into proof that a single response works for everyone.',
            },
            {
                title: 'Moderate every public campaign',
                body: 'Posts about suicide can draw urgent disclosures. Decide who is watching replies, what they will say, and how they will direct someone to immediate help before the first post goes live.',
            },
        ],
        campaignIdeas: [
            'Build the frame around one local crisis resource and put that resource in every caption.',
            'Ask trained staff to record short answers to "what happens when I ask for help here?"',
            'Run a weekly check-in prompt that can be answered privately, not a public disclosure campaign.',
            'Give managers, resident advisers or coaches a one-page response path alongside the frame link.',
            'Partner with a local prevention organisation and let its clinicians review the campaign language.',
            'Keep the resource page live after September; a crisis does not follow the awareness calendar.',
        ],
        faqs: [
            { q: 'When is Suicide Prevention Month?', a: 'It is observed throughout September. World Suicide Prevention Day falls on September 10 each year.' },
            { q: 'What colours represent suicide prevention?', a: 'Teal and purple are commonly used together. A campaign should pair them with an accurate local crisis resource rather than relying on colour alone.' },
            { q: 'Does asking someone about suicide make it more likely?', a: 'No. Asking directly does not cause suicidal thoughts and can make it easier for someone to tell you what is happening. If there is immediate danger, contact local emergency services.' },
            { q: 'What number should a US campaign publish?', a: 'In the United States, call or text 988 to reach the Suicide & Crisis Lifeline. Organisations elsewhere should publish the appropriate service for their own country or region.' },
            { q: 'Can people use the frame without creating an account?', a: 'Yes. They open the campaign link, add a photo, and download it without signing up.' },
        ],
        relatedUseCases: ['awareness-campaigns', 'nonprofits', 'schools', 'universities', 'companies'],
        relatedDays: ['world-mental-health-day', 'national-nonprofit-day'],
    },
    {
        slug: 'childhood-cancer-awareness-month',
        name: 'Childhood Cancer Awareness Month',
        kind: 'month',
        date: { type: 'month', month: 9 },
        colors: [{ name: 'Childhood cancer gold', hex: '#F5C518' }],
        category: 'awareness',
        audience: ['Childhood cancer nonprofits', 'Hospitals', 'Schools', 'Families', 'Fundraisers'],
        keyword: 'childhood cancer awareness month profile picture frame',
        tagline: 'Go gold for the children in treatment, and keep showing up for the families around them.',
        intro: [
            'September is Childhood Cancer Awareness Month, often called Go Gold month. For families in treatment, awareness is useful when it turns into meals, blood donations, research funding or one less appointment they have to manage alone.',
            'A gold profile frame lets a hospital, school or fundraiser gather those people around one visible sign. The strongest campaign names the practical thing the family or programme needs next.',
        ],
        background: [
            'Gold is the internationally recognised colour for childhood cancer awareness. Advocates use September to draw attention to childhood cancers as a group, although the diseases, treatments and outcomes differ sharply from one diagnosis to another.',
            'The World Health Organization estimates that about 400,000 children and adolescents aged 0 to 19 develop cancer each year. Survival exceeds 80% in many high-income countries but remains below 30% in some low- and middle-income countries, where diagnosis and treatment are harder to reach.',
            'That gap is why "awareness" cannot stop at inspirational stories. Reliable transport, accommodation near treatment, blood supplies, family income support and access to appropriate medicines all shape whether a child can complete care.',
        ],
        howToCelebrate: [
            {
                title: 'Ask the family what would remove one job',
                body: 'Do not make them coordinate a vague offer of help. Offer school pickup on Tuesday, a meal that freezes well, or a lift to one named appointment. Specific help is easier to accept.',
            },
            {
                title: 'Donate blood if you are eligible',
                body: 'Children receiving chemotherapy may need blood or platelet transfusions. Book through your local blood service and follow its eligibility guidance; one actual appointment does more than a month of gold graphics.',
            },
            {
                title: 'Support siblings too',
                body: 'Treatment reorganises the whole household. Taking a sibling to practice, remembering their school event, or giving them an afternoon that is not about cancer can be a real relief.',
            },
            {
                title: 'Follow the family\'s language',
                body: 'Some families say fighter or warrior; others dislike both. Use the child\'s name, diagnosis and words only with permission, and do not make bravery the price of receiving support.',
            },
            {
                title: 'Go gold with somewhere to point',
                body: 'Wear a gold frame, then link to a hospital fund, research charity or family campaign you have checked. The colour gets attention; the destination gives that attention a job.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Name the unmet cost',
                body: 'A target such as ten nights of family accommodation or a month of hospital transport is easier to understand than a general appeal. Show what the amount changes.',
            },
            {
                title: 'Protect the child\'s privacy',
                body: 'Obtain clear consent for every image and detail, and make saying no easy. A child should not have to surrender their medical story for a programme to raise money.',
            },
            {
                title: 'Give schools a concrete role',
                body: 'Classmates can wear gold, write cards or fund one practical need without asking the family to organise the activity. Check infection precautions before planning visits.',
            },
            {
                title: 'Report back in October',
                body: 'Tell supporters how much came in and what it paid for. Closing the loop turns a seasonal burst into trust that survives until the next need.',
            },
        ],
        campaignIdeas: [
            'Create one gold frame for patients, families, clinicians and donors so the month reads as a shared effort.',
            'Tie each week to a practical need: blood, transport, family accommodation and research.',
            'Ask a hospital social worker which family-support fund is hardest to explain and build the campaign around it.',
            'Give participating schools a frame link and one age-appropriate fact sheet reviewed by clinicians.',
            'Run a matched-gift day on a date the treatment programme can staff and answer questions.',
            'Publish a final receipt showing what the campaign funded, without exposing any child\'s private information.',
        ],
        faqs: [
            { q: 'When is Childhood Cancer Awareness Month?', a: 'It is observed throughout September, with gold used as its recognised awareness colour.' },
            { q: 'Why is the ribbon gold?', a: 'Gold is used internationally to represent childhood cancer. Advocacy groups often call September Go Gold month.' },
            { q: 'Are childhood cancers the same as adult cancers?', a: 'No. The cancers most common in children, their biology and their treatment can differ substantially from cancers commonly diagnosed in adults.' },
            { q: 'What is a useful way to help a family in treatment?', a: 'Ask about one specific need such as transport, meals, sibling care or accommodation. Follow the family\'s privacy preferences instead of assuming they want their story shared.' },
            { q: 'Can our hospital or school use its own gold design?', a: 'Yes. Set the exact colours in the builder or upload a finished transparent PNG. Supporters do not need accounts.' },
        ],
        relatedUseCases: ['awareness-campaigns', 'fundraisers', 'nonprofits', 'schools'],
        relatedDays: ['suicide-prevention-month', 'national-nonprofit-day'],
    },
    {
        slug: 'world-alzheimers-month',
        name: 'World Alzheimer\'s Month',
        kind: 'month',
        date: { type: 'month', month: 9 },
        colors: [{ name: 'Alzheimer\'s awareness purple', hex: '#7C3AED' }],
        category: 'awareness',
        audience: ['Dementia organisations', 'Care partners', 'Memory clinics', 'Senior communities', 'Researchers'],
        keyword: 'world alzheimer\'s month profile picture frame',
        tagline: 'Make room for the person who is still here, and for the people doing the daily care.',
        intro: [
            'September is World Alzheimer\'s Month, with World Alzheimer\'s Day on September 21. It is a month for challenging stigma, but also for making ordinary places easier to use when memory, language or orientation changes.',
            'A purple profile frame can bring care partners, clinicians, families and local services into the same campaign. Pair it with one useful contact or one change people can make in real life.',
        ],
        background: [
            'Alzheimer\'s Disease International launched World Alzheimer\'s Month in 2012. World Alzheimer\'s Day is older: it was introduced on September 21, 1994, during the organisation\'s tenth anniversary.',
            'Alzheimer\'s disease is the most common cause of dementia, but the terms are not interchangeable. Dementia describes a group of symptoms that can have several causes; Alzheimer\'s is one disease that causes those symptoms.',
            'Stigma can delay diagnosis and isolate both the person with dementia and those caring for them. Useful awareness work replaces euphemism and fear with clear information, accessible services and continued invitations to take part.',
        ],
        howToCelebrate: [
            {
                title: 'Keep speaking to the person',
                body: 'Do not redirect every question to the care partner. Use the person\'s name, allow time for an answer, and include them in decisions that concern them.',
            },
            {
                title: 'Make one visit easier',
                body: 'Choose a familiar place, reduce background noise and do not test their memory with "do you remember me?" Introduce yourself naturally and let the conversation begin where it begins.',
            },
            {
                title: 'Give a care partner a real break',
                body: 'Offer a specific two-hour window, a meal, or one errand you can complete without supervision. "Call if you need anything" leaves another planning task with the person already carrying most of them.',
            },
            {
                title: 'Learn the difference between dementia and Alzheimer\'s',
                body: 'Dementia is an umbrella term; Alzheimer\'s disease is one cause. Knowing that small distinction makes conversations with families and clinicians more accurate immediately.',
            },
            {
                title: 'Wear purple and link locally',
                body: 'Use the frame, then point people to a memory clinic, dementia navigator, caregiver group or helpline they can actually reach. A global month becomes useful through local doors.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Show what an assessment involves',
                body: 'Fear grows in the blank space before a first appointment. Explain who attends, how long it takes, what information to bring, and what happens after the assessment.',
            },
            {
                title: 'Audit the building with a person who uses it',
                body: 'Clear signs, quiet waiting areas, visible toilets and consistent staff introductions can matter more than another awareness banner. Invite people living with dementia to identify what gets in their way.',
            },
            {
                title: 'Recognise unpaid care',
                body: 'Care partners need respite, flexible appointments and direct information, not ceremonial praise. Publish the route to those services beside every September story.',
            },
            {
                title: 'Use images with dignity',
                body: 'Avoid portraying every person as confused, frail or absent. Dementia changes abilities, but people continue to have preferences, relationships, humour and a right to be represented as themselves.',
            },
        ],
        campaignIdeas: [
            'Create a purple frame shared by families, clinicians, volunteers and dementia-friendly businesses.',
            'Film the route from the clinic entrance to the assessment room so a first visit contains fewer surprises.',
            'Run one weekly post correcting a specific misconception, reviewed by a dementia clinician.',
            'Ask local shops to pair the frame with one concrete dementia-friendly change they have made.',
            'Hold a listening session led by people living with dementia and publish the changes that follow.',
            'Keep a permanent local-services link in every caption so September traffic still finds help later.',
        ],
        faqs: [
            { q: 'When is World Alzheimer\'s Month?', a: 'It runs throughout September. World Alzheimer\'s Day is September 21 every year.' },
            { q: 'When did World Alzheimer\'s Month begin?', a: 'Alzheimer\'s Disease International launched the month-long campaign in 2012. World Alzheimer\'s Day began in 1994.' },
            { q: 'Are dementia and Alzheimer\'s disease the same thing?', a: 'No. Dementia is an umbrella term for a set of symptoms. Alzheimer\'s disease is the most common cause of dementia.' },
            { q: 'What colour is used for Alzheimer\'s awareness?', a: 'Purple is widely used by Alzheimer\'s and dementia organisations, although branding varies by country.' },
            { q: 'Can a memory clinic make a shared frame?', a: 'Yes. Create one campaign link and send it to staff, families and partners. Nobody needs an account to add their photo.' },
        ],
        relatedUseCases: ['awareness-campaigns', 'nonprofits', 'fundraisers', 'universities'],
        relatedDays: ['world-mental-health-day', 'national-nonprofit-day'],
    },
    {
        slug: 'hispanic-heritage-month',
        name: 'Hispanic Heritage Month',
        kind: 'month',
        date: { type: 'range', from: [9, 15], to: [10, 15] },
        colors: [
            { name: 'Festival red', hex: '#DC2626' },
            { name: 'Marigold', hex: '#F59E0B' },
            { name: 'Caribbean blue', hex: '#0284C7' },
        ],
        category: 'community',
        audience: ['Community organisations', 'Schools', 'Universities', 'Libraries', 'Employee groups'],
        keyword: 'hispanic heritage month profile picture frame',
        tagline: 'A month for names, places and living communities, not one flattened idea of a culture.',
        intro: [
            'Hispanic Heritage Month runs from September 15 to October 15 in the United States. The unusual mid-month dates connect it to independence anniversaries across Latin America rather than to a marketing calendar.',
            'A shared frame works when the campaign leaves room for people to name their own country, language and relationship to the term Hispanic. It should open a conversation, not stand in for one.',
        ],
        background: [
            'The observance began as Hispanic Heritage Week in 1968 under President Lyndon B. Johnson. Congress expanded it to 31 days in 1988, and President Ronald Reagan signed that change into law.',
            'September 15 is the independence anniversary of Costa Rica, El Salvador, Guatemala, Honduras and Nicaragua. Mexico marks independence on September 16 and Chile on September 18, which explains why the US observance begins halfway through September.',
            'Hispanic and Latino are broad, overlapping terms rather than interchangeable identities for everyone. Communities include many races, national origins and languages, including Indigenous languages, Portuguese and English alongside Spanish.',
        ],
        howToCelebrate: [
            {
                title: 'Start with one place, not a continent',
                body: 'Choose a writer from Puerto Rico, a recipe from Oaxaca, or music from the Dominican Republic and learn enough to name where it comes from. "Latin culture" is too broad to tell you much.',
            },
            {
                title: 'Buy from the business directly',
                body: 'Order from a locally owned restaurant, bookshop or maker and pay the listed price. A purchase that reaches the owner is more useful than reposting a directory you never visit.',
            },
            {
                title: 'Listen to how people identify themselves',
                body: 'Hispanic, Latino, Latina, Latine and national identities carry different meanings. Use the word a person uses for themselves instead of turning terminology into a test they have to pass.',
            },
            {
                title: 'Learn the history under your feet',
                body: 'Look for the neighbourhood, labour, migration or civil-rights history of Hispanic communities where you live. Local archives and oral-history collections are usually more revealing than a generic national timeline.',
            },
            {
                title: 'Wear a frame that leaves room for a name',
                body: 'A shared frame can mark the month without pretending everyone shares one story. Pair it with a caption naming your family, community, country or the person whose work you are learning from.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Pay contributors for expertise',
                body: 'A speaker, translator or artist is doing work, not donating authenticity. Put compensation in the plan before invitations go out.',
            },
            {
                title: 'Let the calendar extend past October 15',
                body: 'Do not introduce a supplier, author or employee group for one month and disappear. Keep procurement, programming and language access moving through the year.',
            },
            {
                title: 'Make the programme internally specific',
                body: 'A panel called "the Hispanic experience" asks a few people to represent millions. A conversation about first-generation college students, Afro-Latino history or bilingual healthcare can go somewhere real.',
            },
            {
                title: 'Check who is doing the extra labour',
                body: 'Employee groups are often asked to design the celebration on top of their jobs. Give them budget, work time and decision-making authority rather than an unpaid cultural assignment.',
            },
        ],
        campaignIdeas: [
            'Build one frame with optional space for a country, city, language or family name.',
            'Run a weekly employee or student portrait written in the participant\'s own words and approved by them.',
            'Partner with a local archive to share one document or oral-history clip with full context.',
            'Create a paid reading, film or music series focused on a different place each week.',
            'Give participating businesses a common frame while letting each one write its own story.',
            'Publish what the organisation will continue funding after October 15.',
        ],
        faqs: [
            { q: 'When is Hispanic Heritage Month?', a: 'It runs from September 15 through October 15 each year in the United States.' },
            { q: 'Why does Hispanic Heritage Month start on September 15?', a: 'September 15 is the independence anniversary of Costa Rica, El Salvador, Guatemala, Honduras and Nicaragua. Mexico and Chile mark independence later that same week.' },
            { q: 'When did the observance begin?', a: 'It began as Hispanic Heritage Week in 1968 and was expanded to a 31-day observance in 1988.' },
            { q: 'Do Hispanic and Latino mean the same thing?', a: 'They overlap, but they are not identical and neither is preferred by everyone. Follow the terms people and communities use for themselves.' },
            { q: 'Can our group make the frame bilingual?', a: 'Yes. Upload a finished transparent PNG with your chosen wording, or create separate campaign designs for different audiences.' },
        ],
        relatedUseCases: ['awareness-campaigns', 'schools', 'universities', 'companies', 'events'],
        relatedDays: ['independencia-do-brasil', 'sumpah-pemuda', 'national-coffee-day'],
    },
    {
        slug: 'breast-cancer-awareness-month',
        name: 'Breast Cancer Awareness Month',
        kind: 'month',
        date: { type: 'month', month: 10 },
        colors: [{ name: 'Breast cancer pink', hex: '#EC4899' }],
        category: 'awareness',
        audience: ['Breast cancer nonprofits', 'Hospitals', 'Clinics', 'Survivor groups', 'Fundraisers'],
        keyword: 'breast cancer awareness month profile picture frame',
        tagline: 'Wear pink, then put the attention somewhere a patient can actually use.',
        intro: [
            'October is Breast Cancer Awareness Month. Pink is everywhere; clear information about screening, metastatic disease, transport and treatment costs is harder to find.',
            'A pink profile frame can gather survivors, clinicians, families and fundraisers around the same campaign. Give that visibility one destination instead of treating the colour as the finished work.',
        ],
        background: [
            'Breast Cancer Awareness Month began in the United States in 1985 as a partnership between the American Cancer Society and the pharmaceutical division of Imperial Chemical Industries. Its early emphasis was encouraging mammography.',
            'The pink ribbon became the dominant symbol in the early 1990s. Today the month covers prevention, screening, treatment, survivorship and metastatic breast cancer, although organisations do not always give those subjects equal attention.',
            'Screening recommendations vary by age, risk and country, so a calendar page cannot tell an individual when to be screened. A useful campaign links to current guidance and encourages people to discuss their personal and family history with a qualified clinician.',
        ],
        howToCelebrate: [
            {
                title: 'Find the guidance that applies to you',
                body: 'Do not use a social post as a screening schedule. Read the current guidance for your country and speak with a clinician about age, symptoms, family history and other risk factors.',
            },
            {
                title: 'Do not wait on a new change',
                body: 'A new lump, skin dimpling, nipple change or other persistent breast change deserves medical attention even if a recent screening result was normal. Screening and evaluating a symptom are different things.',
            },
            {
                title: 'Offer help that fits treatment',
                body: 'A lift, childcare, a meal left without requiring a visit, or notes taken during an appointment can be more useful than another pink gift. Ask before arriving; treatment can make energy and infection risk unpredictable.',
            },
            {
                title: 'Include metastatic breast cancer',
                body: 'October stories often end at remission. Make room for people living with stage IV disease, whose need is ongoing treatment, research and support rather than a tidy survivor narrative.',
            },
            {
                title: 'Wear pink with a named destination',
                body: 'Use the frame and link to a patient fund, screening service or research programme you have checked. Ask where money goes before turning a purchase into a donation.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Publish the route into care',
                body: 'Give the booking number, eligibility rules, cost or insurance information, language options and what happens after an abnormal result. Access details are more useful than a reminder to screen.',
            },
            {
                title: 'Be precise about donations',
                body: 'State the amount or percentage that reaches the programme and whether there is a cap. "A portion of proceeds" asks patients to lend credibility to a number nobody can see.',
            },
            {
                title: 'Show more than survivorship',
                body: 'Include metastatic patients, people in active treatment and people dealing with recurrence or long-term effects. Nobody should have to present cancer as an uplifting arc to belong in the month.',
            },
            {
                title: 'Review every medical claim',
                body: 'Have a qualified clinician check screening, risk and symptom language before publication. Recommendations change, and a familiar slogan can still be medically incomplete.',
            },
        ],
        campaignIdeas: [
            'Create one pink frame and pair it with a verified local screening or navigation service.',
            'Fund a concrete barrier such as transport, childcare or interpretation for appointments.',
            'Give metastatic breast cancer its own post, speaker and donation destination rather than one closing sentence.',
            'Ask clinicians to explain what happens after an abnormal screening result in plain language.',
            'Publish the exact donation calculation beside every pink product or fundraiser.',
            'Report the final amount and recipient after October instead of letting the campaign end at the checkout.',
        ],
        faqs: [
            { q: 'When is Breast Cancer Awareness Month?', a: 'It is observed throughout October each year.' },
            { q: 'What colour represents breast cancer awareness?', a: 'Pink is the best-known colour. Some metastatic breast cancer campaigns also use green, teal and pink to distinguish their focus.' },
            { q: 'When did Breast Cancer Awareness Month begin?', a: 'It began in the United States in 1985 through a partnership between the American Cancer Society and the pharmaceutical division of Imperial Chemical Industries.' },
            { q: 'When should I get breast cancer screening?', a: 'Recommendations vary by country, age and individual risk. Use current local guidance and discuss your personal history with a qualified clinician.' },
            { q: 'Can a clinic use its own campaign artwork?', a: 'Yes. Upload a transparent PNG or set exact campaign colours. Patients and supporters can use the frame without accounts.' },
        ],
        relatedUseCases: ['awareness-campaigns', 'fundraisers', 'nonprofits', 'companies'],
        relatedDays: ['childhood-cancer-awareness-month', 'national-nonprofit-day'],
    },
    {
        slug: 'domestic-violence-awareness-month',
        name: 'Domestic Violence Awareness Month',
        kind: 'month',
        date: { type: 'month', month: 10 },
        colors: [{ name: 'Domestic violence awareness purple', hex: '#6D28D9' }],
        category: 'awareness',
        audience: ['Domestic violence services', 'Shelters', 'Legal aid groups', 'Universities', 'Workplaces'],
        keyword: 'domestic violence awareness month profile picture frame',
        tagline: 'Believe people, protect their choices, and make the route to help easy to find.',
        intro: [
            'October is Domestic Violence Awareness Month. For someone being monitored at home, even searching for help can carry risk, so the useful details are discreet contact options, safe-device guidance and advocates who will not take control away from them.',
            'A purple profile frame can show that a workplace, campus or community believes survivors. The campaign behind it needs to be as careful as the symbol is visible.',
        ],
        background: [
            'Domestic Violence Awareness Month grew from the Day of Unity organised by the National Coalition Against Domestic Violence in October 1981. The observance expanded to a week and the first national month was marked in October 1987.',
            'Purple is widely used to represent domestic violence awareness. Advocates use the month to honour people killed by abuse, recognise survivors and connect communities with services.',
            'Domestic violence can include physical and sexual violence, stalking, threats, coercive control, financial abuse and technology-facilitated monitoring. Leaving is not a single safe or available step for everyone, which is why survivor-led safety planning matters.',
        ],
        howToCelebrate: [
            {
                title: 'Save the service under a neutral name',
                body: 'If somebody you know may have their phone checked, ask before sending links or messages. A local advocate can help think through safer contact methods and device use.',
            },
            {
                title: 'Believe the first disclosure',
                body: 'Say "I believe you", "this is not your fault", and "what would feel useful right now?" Do not interrogate details or make continued support depend on leaving immediately.',
            },
            {
                title: 'Offer choices, not commands',
                body: 'Abuse removes control. Support should not repeat that pattern. Offer a ride, document storage, childcare or company on a call, then let the survivor decide what is safe.',
            },
            {
                title: 'Learn your workplace or campus route',
                body: 'Find out which office handles emergency leave, accommodation, housing changes or protection orders before someone needs it. If the policy is impossible to locate, tell the organisation.',
            },
            {
                title: 'Wear purple without identifying anyone',
                body: 'Use the frame to support services or name your organisation\'s policy. Never hint at somebody else\'s experience, even positively, without clear permission.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Put safety before engagement',
                body: 'Do not ask followers to disclose abuse in public comments. Moderate replies, provide a private route, and warn that internet use may be monitored when publishing online resources.',
            },
            {
                title: 'Audit the policy against real situations',
                body: 'Emergency leave, schedule changes, address privacy and workplace safety plans need named decision-makers. A policy that requires repeated disclosure to several managers is another barrier.',
            },
            {
                title: 'Fund advocates, not only awareness',
                body: 'Shelters and legal services need unrestricted money for transport, hotel rooms, phones and staff time. Let the local programme say what is hardest to fund.',
            },
            {
                title: 'Keep survivor stories voluntary',
                body: 'Never make a personal account the admission price for support or publicity. Pay contributors where appropriate and let them withdraw details before publication.',
            },
        ],
        campaignIdeas: [
            'Build a purple frame with a discreet local helpline or service page in every accompanying caption.',
            'Ask advocates to review all safety, technology and leaving language before launch.',
            'Train managers or resident advisers, then publish the exact private route for requesting help.',
            'Fund one practical category chosen by a local service, such as transport or emergency accommodation.',
            'Use staff portraits to explain policy without asking survivors to identify themselves.',
            'Keep the resource page and moderation plan active after October.',
        ],
        faqs: [
            { q: 'When is Domestic Violence Awareness Month?', a: 'It is observed throughout October each year.' },
            { q: 'Why is purple used for domestic violence awareness?', a: 'Purple is the widely recognised colour used by survivor services and advocacy organisations during the month.' },
            { q: 'When did the national observance begin?', a: 'It grew from the Day of Unity first held in 1981. The first national Domestic Violence Awareness Month was observed in October 1987.' },
            { q: 'What should I say if someone discloses abuse?', a: 'Tell them you believe them, that the abuse is not their fault, and ask what support feels safe. Avoid pressuring them to leave or contacting the abusive person.' },
            { q: 'Can our service create a frame without exposing clients?', a: 'Yes. Staff, partners and supporters can carry the campaign without identifying service users. Nobody needs an account to use the frame.' },
        ],
        relatedUseCases: ['awareness-campaigns', 'nonprofits', 'fundraisers', 'universities', 'companies'],
        relatedDays: ['suicide-prevention-month', 'world-mental-health-day', 'national-nonprofit-day'],
    },
    {
        slug: 'world-mental-health-day',
        name: 'World Mental Health Day',
        kind: 'day',
        date: { type: 'fixed', month: 10, day: 10 },
        colors: [
            { name: 'Mental health green', hex: '#16A34A' },
            { name: 'Calm teal', hex: '#14B8A6' },
        ],
        category: 'awareness',
        audience: ['Mental health organisations', 'Clinics', 'Schools', 'Universities', 'Workplaces'],
        keyword: 'world mental health day profile picture frame',
        tagline: 'One day to make support easier to find and safer to ask for.',
        intro: [
            'World Mental Health Day is October 10. It is most useful when organisations explain what support actually looks like: who answers, what it costs, whether it is confidential, and how long someone may wait.',
            'A shared green frame can make the day visible across a school, workplace or community. Pair it with one honest route to help instead of asking everyone to perform wellness in public.',
        ],
        background: [
            'World Mental Health Day was first observed on October 10, 1992, as an initiative of the World Federation for Mental Health. It is now marked internationally, with the World Health Organization supporting awareness and advocacy around the day.',
            'The annual theme can change, but October 10 does not. Organisations should check the current theme with the World Federation for Mental Health or WHO rather than reusing an old campaign line.',
            'Mental health is broader than mental illness, and neither is improved by pretending every problem can be solved with individual resilience. Cost, discrimination, workload, housing, safety and access to qualified care all belong in the conversation.',
        ],
        howToCelebrate: [
            {
                title: 'Ask a smaller question',
                body: '"How are you?" is easy to escape. Try "how has this week actually been?" or "do you want company, help solving it, or space?" A narrower question is often easier to answer honestly.',
            },
            {
                title: 'Put one appointment on the calendar',
                body: 'If you have been postponing a GP, therapist, counsellor or support-group call, make the first contact today. You do not need to solve the whole problem in one booking.',
            },
            {
                title: 'Take pressure off someone else',
                body: 'Mental health support can look like childcare, food, a walk to an appointment or handling one piece of paperwork. Ask which practical task is making the week heavier.',
            },
            {
                title: 'Check the qualifications behind advice',
                body: 'A large following is not a clinical credential. Use health-system, professional-body or established nonprofit sources for treatment claims, and treat personal stories as personal stories.',
            },
            {
                title: 'Wear the frame without demanding disclosure',
                body: 'A profile frame can say support matters without requiring anyone to publish a diagnosis. Share the link as an invitation and let people opt in quietly.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Publish the waiting time honestly',
                body: 'If counselling has a six-week wait, say so and list interim and urgent options. People can plan around a hard truth more safely than a promise of support with no date.',
            },
            {
                title: 'Fix one source of preventable strain',
                body: 'A wellness webinar does not repair unpredictable shifts, impossible workloads or harassment. Use the day to announce one structural change and name who is accountable for it.',
            },
            {
                title: 'Give managers a response script',
                body: 'Teach them what is confidential, what must be escalated and which adjustments they can approve. Improvisation is where sympathetic conversations turn into unsafe promises.',
            },
            {
                title: 'Keep participation private and optional',
                body: 'Do not ask employees or students to disclose diagnoses, take public pledges or explain why they skipped an activity. A mental health campaign should not create another social test.',
            },
        ],
        campaignIdeas: [
            'Create a green frame and attach one local support directory to every share message.',
            'Publish a plain-language walkthrough of booking, cost, confidentiality and waiting time.',
            'Ask leaders to name one working or learning condition they will change, with a deadline.',
            'Host separate peer, clinical and crisis-support sessions so people know what each can and cannot provide.',
            'Give managers, teachers or coaches a reviewed response card before October 10.',
            'Leave the support directory in the main navigation after the campaign ends.',
        ],
        faqs: [
            { q: 'When is World Mental Health Day?', a: 'It is October 10 every year. In 2026 it falls on a Saturday.' },
            { q: 'When did World Mental Health Day begin?', a: 'The World Federation for Mental Health first observed it on October 10, 1992.' },
            { q: 'What colour represents World Mental Health Day?', a: 'Green is widely associated with mental health awareness, although official campaign artwork and annual themes can vary.' },
            { q: 'Where can I find the official annual theme?', a: 'Check current material from the World Federation for Mental Health or the World Health Organization. Do not assume a previous year\'s theme still applies.' },
            { q: 'Do people need accounts to use a mental health frame?', a: 'No. They open the campaign link, add a photo, and download it without signing up.' },
        ],
        relatedUseCases: ['awareness-campaigns', 'nonprofits', 'schools', 'universities', 'companies'],
        relatedDays: ['suicide-prevention-month', 'domestic-violence-awareness-month', 'world-alzheimers-month'],
    },
    {
        slug: 'unity-day',
        name: 'Unity Day',
        kind: 'day',
        date: { type: 'nth-weekday', month: 10, weekday: 3, n: 3 },
        colors: [
            { name: 'Unity orange', hex: '#F97316' },
            { name: 'Hope yellow', hex: '#FACC15' },
        ],
        category: 'school',
        audience: ['Schools', 'Students', 'Teachers', 'Parent groups', 'Youth organisations'],
        keyword: 'unity day anti bullying profile picture frame',
        tagline: 'Wear orange, include the person left out, and make the reporting route work.',
        intro: [
            'Unity Day is the third Wednesday of October, during National Bullying Prevention Month in the United States. Students and adults wear orange to show that bullying is not accepted and nobody should be pushed to the edge of school life.',
            'A shared orange frame can make the whole school visible in that promise. It matters only if students also know which adult will listen, what happens after a report, and how retaliation will be handled.',
        ],
        background: [
            'PACER\'s National Bullying Prevention Center introduced Unity Day in 2011. Orange was chosen as a visible colour for unity, kindness, acceptance and inclusion.',
            'The date follows a rule rather than a fixed number: the third Wednesday of October. In 2026, Unity Day falls on October 21.',
            'Bullying involves repeated aggressive behaviour and a real or perceived power imbalance. Not every conflict between students is bullying, but dismissing repeated exclusion, humiliation or harassment as ordinary conflict can leave the targeted student carrying the entire response.',
        ],
        howToCelebrate: [
            {
                title: 'Sit with the person who is being isolated',
                body: 'A poster is abstract; lunch is not. If someone is routinely left out, make a normal invitation and stay long enough that it does not feel like a one-day charity gesture.',
            },
            {
                title: 'Interrupt without starting a performance',
                body: 'A short "that is not funny" or "leave them out of it" can stop a moment without turning the targeted person into the centre of a crowd. Check in privately afterwards.',
            },
            {
                title: 'Save evidence before reporting online abuse',
                body: 'Take screenshots that include dates, usernames and context, then use the school and platform reporting routes. Do not keep resharing harmful material to prove it exists.',
            },
            {
                title: 'Ask what support the student wants',
                body: 'Reporting over someone\'s head can increase risk if retaliation is likely. Unless immediate safety requires urgent action, include the targeted person in deciding which adult to involve.',
            },
            {
                title: 'Wear orange and do the next thing',
                body: 'Add the Unity Day frame, then make one invitation, interruption or report you would have avoided yesterday. The colour tells people the standard; behaviour proves it.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Test the reporting route with students',
                body: 'Ask students to find it and explain what happens next. If they cannot do that in two minutes, the process is not accessible no matter how complete the policy looks.',
            },
            {
                title: 'Plan for retaliation',
                body: 'The risk does not end when a report is made. Schedule check-ins, monitor shared spaces and tell the student who will respond if behaviour shifts online or outside class.',
            },
            {
                title: 'Include adults in the standard',
                body: 'Students notice when staff humiliation, favouritism or dismissive jokes are exempt from the campaign. Give employees the same behavioural expectations and reporting accountability.',
            },
            {
                title: 'Do not force public pledges',
                body: 'A student may have private reasons not to wear orange or sign a banner. Make the frame and activities optional while keeping safety and conduct expectations universal.',
            },
        ],
        campaignIdeas: [
            'Create one orange frame for students, families, teachers, coaches and school partners.',
            'Put the reporting route and expected response time beside every Unity Day post.',
            'Ask students to map the places and times where adult supervision disappears.',
            'Train peer leaders to interrupt and refer without asking them to investigate reports.',
            'Run a quiet inclusion challenge built around invitations rather than public nominations.',
            'Publish the policy changes made from student feedback before the next Unity Day.',
        ],
        faqs: [
            { q: 'When is Unity Day 2026?', a: 'Wednesday, October 21, 2026. Unity Day is observed on the third Wednesday of October.' },
            { q: 'Who started Unity Day?', a: 'PACER\'s National Bullying Prevention Center introduced Unity Day in 2011 as part of National Bullying Prevention Month.' },
            { q: 'Why do people wear orange on Unity Day?', a: 'Orange represents unity, kindness, acceptance and inclusion, and it is visible enough for a school-wide campaign.' },
            { q: 'Is every student conflict bullying?', a: 'No. Bullying generally involves repeated aggressive behaviour and a real or perceived power imbalance. Schools still need to respond appropriately to harmful conduct that does not meet that definition.' },
            { q: 'Can a school make one frame for every year group?', a: 'Yes. Share one campaign link across the school, or make separate versions for houses and campuses. Students do not need accounts.' },
        ],
        relatedUseCases: ['schools', 'universities', 'awareness-campaigns', 'nonprofits'],
        relatedDays: ['world-mental-health-day', 'suicide-prevention-month', 'dia-das-criancas'],
    },
    {
        slug: 'independencia-do-brasil',
        name: 'Independência do Brasil',
        kind: 'day',
        date: { type: 'fixed', month: 9, day: 7 },
        colors: [
            { name: 'Brazil green', hex: '#009C3B' },
            { name: 'Brazil yellow', hex: '#FFDF00' },
        ],
        category: 'community',
        audience: ['Brazilian communities', 'Schools', 'Universities', 'Cultural organisations', 'Brazilian businesses'],
        keyword: 'brazil independence day profile picture frame',
        tagline: 'Sete de Setembro, carried by Brazilians at home and everywhere else.',
        intro: [
            'Brazil marks Independence Day on September 7, known in Portuguese as Sete de Setembro or Dia da Independência. The green and yellow appear everywhere, from civic ceremonies in Brazil to community gatherings abroad.',
            'A shared profile frame gives schools, families, associations and Brazilian businesses one link for the day. Use it to name the place, people or tradition your celebration actually belongs to.',
        ],
        background: [
            'On September 7, 1822, Prince Pedro declared Brazil\'s separation from Portugal near the Ipiranga River in São Paulo. He became Pedro I, the first emperor of Brazil, later that year.',
            'The declaration did not end the process immediately. Fighting continued in several provinces, and Portugal formally recognised Brazilian independence in 1825.',
            'September 7 is a national public holiday in Brazil. Official military and civic events are only one part of the day; schools, neighbourhood groups and Brazilian communities abroad also use it to talk about national identity and the country\'s unfinished history.',
        ],
        howToCelebrate: [
            {
                title: 'Learn what happened after the declaration',
                body: 'The familiar image is Pedro beside the Ipiranga, but independence involved fighting in several provinces and was not recognised by Portugal until 1825. The short version is a beginning, not the whole process.',
            },
            {
                title: 'Cook one dish with a place attached',
                body: 'Brazilian food is regional. Name Minas Gerais, Bahia, Pará, Rio Grande do Sul or the place your recipe comes from instead of presenting one plate as the country.',
            },
            {
                title: 'Listen beyond the national playlist',
                body: 'Choose an artist from a state or tradition you do not already know and read enough to place the music. Brazil is too large for a single sound to carry the day.',
            },
            {
                title: 'Call the person who taught you home',
                body: 'For Brazilians abroad, September 7 can be less about ceremony than language, food and people. A call to family or the friend who keeps the community together is a celebration that survives distance.',
            },
            {
                title: 'Wear green and yellow in your own words',
                body: 'Use the frame and add a caption in Portuguese, English or both. Name your city, state, family or association so the post belongs to a real Brazilian community.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Give history more than one scene',
                body: 'Schools can start at the Ipiranga without ending there. Include regional struggles, the imperial period and the people excluded from the political settlement.',
            },
            {
                title: 'Let Brazilians abroad define the event',
                body: 'A diaspora gathering may centre food, music, language or children meeting other Brazilian families. Give local organisers the budget and let them decide what feels like home.',
            },
            {
                title: 'Keep national colours politically neutral',
                body: 'Green and yellow belong to the country, but audiences may read contemporary political meaning into them. State the civic or community purpose clearly and avoid partisan slogans unless that is explicitly the event.',
            },
            {
                title: 'Make the programme bilingual where needed',
                body: 'Portuguese carries the day; English may help partners and younger diaspora members take part. Good translation includes both without treating either audience as an afterthought.',
            },
        ],
        campaignIdeas: [
            'Create a green and yellow frame with Sete de Setembro and an optional city or state name.',
            'Invite community members to post one photograph of the Brazil they want others to understand.',
            'Build a school timeline from 1822 through Portuguese recognition in 1825 rather than stopping at the declaration.',
            'Ask Brazilian-owned businesses to share one common frame while naming their own regional roots.',
            'Run a bilingual portrait series with each participant approving their Portuguese and English text.',
            'Save the campaign design and update only the date or community name next September.',
        ],
        faqs: [
            { q: 'When is Brazil Independence Day?', a: 'September 7 every year. In Portuguese it is commonly called Sete de Setembro or Dia da Independência.' },
            { q: 'What happened on September 7, 1822?', a: 'Prince Pedro declared Brazil\'s separation from Portugal near the Ipiranga River in São Paulo. He became Emperor Pedro I later that year.' },
            { q: 'Did Brazil become independent immediately?', a: 'The declaration was a decisive moment, but fighting continued in several provinces and Portugal formally recognised independence in 1825.' },
            { q: 'Is September 7 a public holiday in Brazil?', a: 'Yes. It is a national holiday marked by civic events and community celebrations.' },
            { q: 'Can our association make a Portuguese frame?', a: 'Yes. Upload Portuguese or bilingual artwork as a transparent PNG, or use green and yellow in the builder. Supporters do not need accounts.' },
        ],
        relatedUseCases: ['events', 'schools', 'universities', 'companies', 'awareness-campaigns'],
        relatedDays: ['hispanic-heritage-month', 'dia-das-criancas', 'labor-day'],
    },
    {
        slug: 'dia-das-criancas',
        name: 'Dia das Crianças',
        kind: 'day',
        date: { type: 'fixed', month: 10, day: 12 },
        colors: [
            { name: 'Playful yellow', hex: '#FACC15' },
            { name: 'Bright blue', hex: '#0EA5E9' },
            { name: 'Festival green', hex: '#22C55E' },
        ],
        category: 'community',
        audience: ['Families', 'Schools', 'Children\'s nonprofits', 'Community groups', 'Brazilian businesses'],
        keyword: 'dia das crianças profile picture frame',
        tagline: 'A Brazilian children\'s day for play, attention and the adults who make room for both.',
        intro: [
            'Brazil celebrates Dia das Crianças on October 12. Gifts are part of the day, but a child usually remembers the adult who stopped, got on the floor and joined the game.',
            'A bright shared frame can connect a school, family, children\'s programme or Brazilian community around the celebration. Let children help choose the colours and words instead of designing the whole thing over their heads.',
        ],
        background: [
            'Brazil established October 12 as Children\'s Day by decree in 1924, during the presidency of Arthur Bernardes. The date became widely popular decades later through commercial promotions involving toy company Estrela and Johnson & Johnson.',
            'October 12 is also the feast day of Our Lady of Aparecida, Brazil\'s patron saint, and a national public holiday. The overlap means family, religious and children\'s events often share the same day.',
            'Dia das Crianças is distinct from Universal Children\'s Day observed by the United Nations on November 20. Brazil\'s October tradition has its own history and is deeply established in schools, shops and family calendars.',
        ],
        howToCelebrate: [
            {
                title: 'Let the child choose the plan',
                body: 'Offer two or three realistic options and accept the answer. An afternoon chosen by a child feels different from an adult programme with children added as decoration.',
            },
            {
                title: 'Give uninterrupted attention',
                body: 'Put the phone away for one game, story or walk and follow their pace. It costs nothing and is often rarer than another object arriving in a bag.',
            },
            {
                title: 'Pass on something still worth playing with',
                body: 'Clean, complete toys and books can go to a community programme that has asked for them. Do not turn donation into disposal; missing pieces create work for somebody else.',
            },
            {
                title: 'Ask before posting a child\'s face',
                body: 'Children deserve privacy on celebration days too. Get the parent or guardian\'s permission, listen if the child says no, and avoid names, uniforms or locations that reveal more than intended.',
            },
            {
                title: 'Make the frame together',
                body: 'Let children choose between colours, words or drawings, then use the shared result on family or programme photos. Participation is more memorable than receiving a finished graphic.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Design from the child\'s height',
                body: 'Walk through the event looking at signs, queues, toilets, noise and seating from a child\'s point of view. Accessibility is easier to see when adults stop assuming their own route works for everyone.',
            },
            {
                title: 'Ask programmes what they need',
                body: 'Children\'s services may need school supplies, transport or unrestricted funds more than toys. Publish the request they give you, not the donation drive that photographs best.',
            },
            {
                title: 'Protect images and names',
                body: 'Use documented consent and provide ways to participate without appearing online. Never connect a child\'s image to medical, financial or family details for campaign effect.',
            },
            {
                title: 'Give children a real decision',
                body: 'A choice of poster colours is not participation if every important decision is already made. Let a small youth group shape one activity, budget line or campaign message adults will actually follow.',
            },
        ],
        campaignIdeas: [
            'Create a colourful frame chosen with a small group of children and approved by safeguarding staff.',
            'Ask families to post a favourite game or book rather than a photograph that reveals a child\'s location.',
            'Pair the frame with one exact request from a local children\'s programme.',
            'Run a no-cost play afternoon with quiet, sensory-friendly and accessible options.',
            'Invite Brazilian families abroad to add their city name to a Portuguese or bilingual frame.',
            'Publish what children asked the organisation to change and report back when it is done.',
        ],
        faqs: [
            { q: 'When is Dia das Crianças in Brazil?', a: 'It is October 12 every year, the same date as the feast of Our Lady of Aparecida and a national public holiday.' },
            { q: 'When was Brazil\'s Children\'s Day established?', a: 'October 12 was established as Children\'s Day by a presidential decree in 1924. The celebration became broadly popular through later commercial campaigns.' },
            { q: 'Is Dia das Crianças the same as Universal Children\'s Day?', a: 'No. The United Nations observes World Children\'s Day on November 20, while Brazil\'s established celebration is October 12.' },
            { q: 'Does the celebration have to involve gifts?', a: 'No. Play, attention, a family outing or supporting a children\'s programme can mark the day without buying toys.' },
            { q: 'Can children help design the frame?', a: 'Yes, provided an adult handles safeguarding and publishing decisions. A school or programme can upload the finished design as a transparent PNG.' },
        ],
        relatedUseCases: ['schools', 'nonprofits', 'events', 'churches', 'fundraisers'],
        relatedDays: ['unity-day', 'independencia-do-brasil', 'childhood-cancer-awareness-month'],
    },
    {
        slug: 'hari-batik',
        name: 'Hari Batik Nasional',
        kind: 'day',
        date: { type: 'fixed', month: 10, day: 2 },
        colors: [
            { name: 'Soga brown', hex: '#8B5A2B' },
            { name: 'Indigo', hex: '#312E81' },
            { name: 'Cream cloth', hex: '#F5E6C8' },
        ],
        category: 'event',
        audience: ['Indonesian communities', 'Schools', 'Universities', 'Cultural organisations', 'Indonesian businesses'],
        keyword: 'hari batik nasional profile picture frame',
        tagline: 'Wear batik, name where it came from, and notice the hands behind the cloth.',
        intro: [
            'Indonesia marks Hari Batik Nasional, or National Batik Day, on October 2. People wear batik to school, work and community events, making the day immediately visible without needing a stage.',
            'A batik-coloured profile frame can carry that celebration online. It works best when the caption names the region, maker or motif instead of treating every patterned cloth as interchangeable.',
        ],
        background: [
            'UNESCO inscribed Indonesian batik on the Representative List of the Intangible Cultural Heritage of Humanity on October 2, 2009. Indonesia marks that anniversary each year as Hari Batik Nasional.',
            'UNESCO recognised more than finished fabric. The inscription describes the techniques, symbolism and culture surrounding hand-dyed cotton and silk, including the way batik accompanies Indonesians from infancy through ceremonies and death.',
            'Batik traditions vary by place. Court batik from Yogyakarta and Surakarta, coastal styles from places such as Pekalongan and Cirebon, and work from many other regions carry different palettes, influences and meanings.',
        ],
        howToCelebrate: [
            {
                title: 'Wear a piece you can identify',
                body: 'Find out whether it is hand-drawn batik tulis, stamped batik cap, a combination, or batik-inspired print. Knowing how it was made changes how you look at the price and the labour.',
            },
            {
                title: 'Ask before assigning a motif',
                body: 'Some motifs carry regional, ceremonial or historical meanings. If you are choosing cloth for an event, ask a knowledgeable maker or seller where it belongs rather than relying on a product caption.',
            },
            {
                title: 'Buy from the person closest to the work',
                body: 'A maker, cooperative or specialist seller can usually tell you who produced the cloth and how. That traceable answer is worth more than a cheap pattern presented without origin.',
            },
            {
                title: 'Look closely at one process',
                body: 'Watch how hot wax is drawn with a canting or applied with a copper cap, then how repeated waxing and dyeing build the design. Batik makes more sense once you see the resist process.',
            },
            {
                title: 'Wear the frame and name the cloth',
                body: 'Use the frame with a caption identifying the place, motif or maker if you know it. If you do not, say that honestly and use the day to learn.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Invite a practitioner, not just a presenter',
                body: 'A batik maker can speak about wax, dye, apprenticeship, pricing and regional practice in a way a generic cultural talk cannot. Pay for both the demonstration and preparation time.',
            },
            {
                title: 'Label every textile properly',
                body: 'Include region, technique, maker or workshop and date where known. "Traditional Indonesian pattern" removes the very specificity the day is meant to protect.',
            },
            {
                title: 'Let staff wear their own batik',
                body: 'A common frame can link the day without prescribing one motif or uniform. Invite people to share what their cloth means to them and make participation optional.',
            },
            {
                title: 'Distinguish batik from batik-style print',
                body: 'Printed fabric can be attractive, but it is not made through the wax-resist process UNESCO recognised. Accurate labels respect both buyers and makers.',
            },
        ],
        campaignIdeas: [
            'Create a brown and indigo frame that leaves the wearer\'s own batik visible.',
            'Ask participants to post one close detail and name the technique or region when known.',
            'Host a paid batik demonstration with enough time to show waxing and dyeing, not only finished cloth.',
            'Build a school map connecting motifs and workshops to different Indonesian regions.',
            'Partner with a maker or cooperative for a transparent sale rather than using an anonymous pattern.',
            'Archive the stories behind staff or family textiles, with the owners\' permission.',
        ],
        faqs: [
            { q: 'When is Hari Batik Nasional?', a: 'It is October 2 every year in Indonesia.' },
            { q: 'Why is National Batik Day on October 2?', a: 'UNESCO inscribed Indonesian batik on its Representative List of the Intangible Cultural Heritage of Humanity on October 2, 2009.' },
            { q: 'What is batik?', a: 'Batik is a wax-resist dyeing tradition. Wax is applied by hand with a canting, with a copper stamp called a cap, or through a combination of techniques before the cloth is dyed.' },
            { q: 'Is every batik-style print handmade batik?', a: 'No. Printed patterns may imitate batik designs without using the wax-resist process. Sellers and exhibitions should label the technique accurately.' },
            { q: 'Can our community use its own batik motif in a frame?', a: 'Yes, if you have permission to use the artwork. Upload a transparent PNG and keep the centre clear for each person\'s photograph.' },
        ],
        relatedUseCases: ['events', 'schools', 'universities', 'companies', 'awareness-campaigns'],
        relatedDays: ['sumpah-pemuda', 'hispanic-heritage-month', 'national-coffee-day'],
    },
    {
        slug: 'sumpah-pemuda',
        name: 'Sumpah Pemuda',
        kind: 'day',
        date: { type: 'fixed', month: 10, day: 28 },
        colors: [
            { name: 'Indonesian red', hex: '#CE1126' },
            { name: 'Indonesian white', hex: '#FFFFFF' },
        ],
        category: 'school',
        audience: ['Indonesian youth groups', 'Schools', 'Universities', 'Student associations', 'Indonesian communities'],
        keyword: 'sumpah pemuda profile picture frame',
        tagline: 'One homeland, one nation, one language — and a day for young people to decide what unity asks now.',
        intro: [
            'Indonesia marks Sumpah Pemuda, or Youth Pledge Day, on October 28. The day remembers young people who declared one homeland, one nation and one language in 1928, before an independent Indonesia existed.',
            'A red and white profile frame can connect students, youth groups and Indonesian communities across cities and campuses. The useful question beside it is what young people are being trusted to lead now.',
        ],
        background: [
            'The Youth Pledge emerged from the Second Youth Congress held in Batavia, now Jakarta, on October 27 and 28, 1928. Delegates from youth organisations across the archipelago affirmed one motherland, one nation and one language: Indonesia.',
            'At the congress, Wage Rudolf Supratman performed Indonesia Raya instrumentally on violin. The song later became Indonesia\'s national anthem.',
            'The pledge did not create independence in 1928; Indonesia proclaimed independence in 1945. Its importance was political imagination: young organisers named a shared Indonesian identity across regional and organisational lines before there was an independent state to contain it.',
        ],
        howToCelebrate: [
            {
                title: 'Read the three statements aloud',
                body: 'Read the Indonesian text, not only an English summary. The repetition of one motherland, one nation and one language is the argument, and it takes less than a minute to hear it.',
            },
            {
                title: 'Learn who was in the room',
                body: 'The pledge came from a congress of youth organisations, not one solitary speech. Look at the groups, organisers and disagreements around the meeting so unity does not become a story without people.',
            },
            {
                title: 'Use Indonesian without mocking another language',
                body: 'The pledge elevated Bahasa Indonesia as a unifying language; it did not make Indonesia\'s regional languages disposable. Practise Indonesian and ask an elder about the language they grew up speaking.',
            },
            {
                title: 'Give a young person the microphone and the decision',
                body: 'A youth panel with no authority is decoration. If you are an adult organiser, hand over one real programme choice, budget or public response and support the result.',
            },
            {
                title: 'Wear red and white with one commitment',
                body: 'Use the frame, then name one thing you will do with people outside your own school, island, organisation or usual circle. Unity becomes credible when it crosses a boundary.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Let students lead the programme',
                body: 'Adults can handle safety and logistics without writing every speech. Give student organisers a clear budget, a decision deadline and room to make something that does not sound like an assembly script.',
            },
            {
                title: 'Teach the congress, not only the pledge',
                body: 'The process shows young organisations negotiating a shared identity across difference. That is more useful to students than memorising three lines without the political work behind them.',
            },
            {
                title: 'Include regional languages and identities',
                body: 'Bahasa Indonesia made national communication possible, while hundreds of local languages remain part of Indonesian life. A serious unity programme can hold both facts at once.',
            },
            {
                title: 'Connect history to present authority',
                body: 'Ask what decisions young people can make in the school, university or organisation today. If the answer is none, the institution has found its most relevant Sumpah Pemuda project.',
            },
        ],
        campaignIdeas: [
            'Create one red and white frame for student groups across different campuses or cities.',
            'Record the pledge in Bahasa Indonesia, with accurate captions and translations for international audiences.',
            'Map the youth organisations represented around the 1928 congress and the regions they came from.',
            'Invite students to propose one cross-community project and give the selected idea a real budget.',
            'Pair portraits of young organisers with the decision or programme each person actually leads.',
            'Ask diaspora groups to add their current city while keeping the same Indonesian campaign frame.',
        ],
        faqs: [
            { q: 'When is Sumpah Pemuda?', a: 'Youth Pledge Day is October 28 every year in Indonesia.' },
            { q: 'What was the Sumpah Pemuda?', a: 'It was the 1928 Youth Pledge affirming one motherland, one nation and one language: Indonesia.' },
            { q: 'Where did the Youth Pledge come from?', a: 'It emerged from the Second Youth Congress held in Batavia, now Jakarta, on October 27 and 28, 1928.' },
            { q: 'Was Indonesia Raya performed at the congress?', a: 'Yes. Wage Rudolf Supratman performed it instrumentally on violin. It later became Indonesia\'s national anthem.' },
            { q: 'Can a student association make a bilingual frame?', a: 'Yes. Upload Indonesian and English artwork as a transparent PNG, or create separate versions using the same red and white colours.' },
        ],
        relatedUseCases: ['schools', 'universities', 'events', 'awareness-campaigns', 'nonprofits'],
        relatedDays: ['hari-batik', 'hispanic-heritage-month', 'unity-day'],
    },
    {
        slug: 'mexico-independence-day',
        name: 'Día de la Independencia de México',
        kind: 'day',
        date: { type: 'fixed', month: 9, day: 16 },
        colors: [
            { name: 'Mexico green', hex: '#006847' },
            { name: 'Mexico red', hex: '#CE1126' },
        ],
        category: 'community',
        audience: ['Mexican communities', 'Schools', 'Cultural organisations'],
        keyword: 'mexico independence day profile picture frame',
        tagline: 'Dieciséis de Septiembre, from Mexico and everywhere Mexicans gather.',
        intro: [
            'Mexico marks Independence Day on September 16, the Grito de Dolores anniversary. Green, white and red show up in plazas, schools and family gatherings on both sides of the border.',
            'One profile frame gives schools, associations and businesses a single link for the day. Name your city or community in the caption so the post belongs to real people.',
        ],
        background: [
            'The Grito tradition remembers Miguel Hidalgo\'s call in Dolores on September 16, 1810, which opened the long war for independence from Spain.',
            'September 16 is a national holiday in Mexico. Celebrations often begin the night before with the ceremonial grito in town squares.',
        ],
        howToCelebrate: [
            { title: 'Learn what the grito commemorates', body: 'The date marks the start of the independence movement, not the day Spain left. That distinction helps posts stay historically honest.' },
            { title: 'Cook one regional dish', body: 'Name the state or city your recipe comes from instead of treating one plate as all of Mexico.' },
            { title: 'Wear the colours in your own words', body: 'Use the frame and add a caption in Spanish, English or both with your city or organisation.' },
        ],
        howOrgsMark: [
            { title: 'Keep civic purpose clear', body: 'Green, white and red carry national meaning. State the community or cultural purpose of your event.' },
            { title: 'Include diaspora voices', body: 'Mexican communities abroad often centre family and language. Let local organisers shape the programme.' },
        ],
        campaignIdeas: [
            'Create a green, white and red frame with optional city name.',
            'Ask participants to name one tradition from their state in the caption.',
            'Pair the frame with a community fundraiser or cultural event link.',
        ],
        faqs: [
            { q: 'When is Mexico Independence Day?', a: 'September 16 every year, commemorating the Grito de Dolores in 1810.' },
            { q: 'Is it the same as Cinco de Mayo?', a: 'No. Cinco de Mayo marks the 1862 Battle of Puebla. September 16 is the national independence anniversary.' },
            { q: 'Can supporters join without an account?', a: 'Yes. They open your link, add a photo, and download. No signup required.' },
        ],
        relatedUseCases: ['events', 'schools', 'churches', 'awareness-campaigns'],
        relatedDays: ['hispanic-heritage-month', 'independencia-do-brasil'],
    },
    {
        slug: 'nigeria-independence-day',
        name: 'Nigeria Independence Day',
        kind: 'day',
        date: { type: 'fixed', month: 10, day: 1 },
        colors: [
            { name: 'Nigeria green', hex: '#008751' },
            { name: 'Nigeria white', hex: '#FFFFFF' },
        ],
        category: 'community',
        audience: ['Nigerian communities', 'Churches', 'Schools', 'Diaspora groups'],
        keyword: 'nigeria independence day profile picture frame',
        tagline: 'October 1, green and white for Nigeria at home and abroad.',
        intro: [
            'Nigeria marks Independence Day on October 1, when the country became a sovereign federation in 1960. Green and white appear in parades, church services and diaspora gatherings worldwide.',
            'A shared frame gives one link for your association, campus fellowship or community group to show up together online.',
        ],
        background: [
            'Nigeria gained independence from the United Kingdom on October 1, 1960, and became a republic in 1963.',
            'The green and white flag was adopted in 1960. Green represents natural wealth; white stands for peace.',
        ],
        howToCelebrate: [
            { title: 'Name your city or state', body: 'Nigeria is diverse. A caption that names Lagos, Enugu, Kaduna or your diaspora city makes the post specific.' },
            { title: 'Support a local cause', body: 'Pair the frame with one organisation or project your community already trusts.' },
            { title: 'Use the flag respectfully', body: 'Keep the frame civic or cultural, not partisan, unless that is explicitly your event.' },
        ],
        howOrgsMark: [
            { title: 'Centre community leaders', body: 'Let pastors, student leaders or association chairs explain why the day matters to your group.' },
            { title: 'Include diaspora time zones', body: 'Schedule posts so Nigerians abroad can join live conversations, not only watch replays.' },
        ],
        campaignIdeas: [
            'Green and white frame with optional city or church name.',
            'Invite members to share one hope for Nigeria in the caption.',
            'Link to a registered charity or community project beside the frame.',
        ],
        faqs: [
            { q: 'When is Nigeria Independence Day?', a: 'October 1 every year, marking independence in 1960.' },
            { q: 'What do the flag colours mean?', a: 'Green represents natural wealth and white represents peace, on the flag adopted at independence.' },
            { q: 'Is Ollabs free for this?', a: 'Yes. Free for organizers and supporters, with no watermark on downloads.' },
        ],
        relatedUseCases: ['churches', 'schools', 'nonprofits', 'events'],
        relatedDays: ['unity-day', 'hispanic-heritage-month'],
    },
    {
        slug: 'malaysia-merdeka',
        name: 'Hari Merdeka',
        kind: 'day',
        date: { type: 'fixed', month: 8, day: 31 },
        colors: [
            { name: 'Malaysia blue', hex: '#010066' },
            { name: 'Malaysia red', hex: '#CC0001' },
            { name: 'Malaysia yellow', hex: '#FFCC00' },
        ],
        category: 'community',
        audience: ['Malaysian communities', 'Schools', 'Universities', 'Businesses'],
        keyword: 'malaysia merdeka profile picture frame',
        tagline: 'Merdeka on August 31, one link for Malaysians everywhere.',
        intro: [
            'Malaysia marks Hari Merdeka on August 31, independence from British rule in 1957. Stripes, crescent and star appear in schools, offices and community events across the country.',
            'A profile frame lets your group share one campaign link for the day, with optional room for state or organisation name.',
        ],
        background: [
            'The Federation of Malaya declared independence on August 31, 1957. Malaysia as it exists today was formed in 1963.',
            'Merdeka celebrations often include parades, flag raising and community gatherings the week of August 31.',
        ],
        howToCelebrate: [
            { title: 'Name your state', body: 'From Penang to Sabah, specificity beats a generic Merdeka post.' },
            { title: 'Share in Bahasa and English', body: 'Many campaigns work best bilingual. Let your audience choose the caption language.' },
            { title: 'Keep it civic', body: 'National symbols carry weight. State the community purpose of your frame clearly.' },
        ],
        howOrgsMark: [
            { title: 'Coordinate schools and alumni', body: 'One frame across campuses and alumni chapters multiplies reach without multiplying design work.' },
            { title: 'Link to a real event', body: 'Pair the frame with parade details, registration or a livestream your group runs.' },
        ],
        campaignIdeas: [
            'Red, white, blue and yellow frame with optional state name.',
            'Ask participants to name one Malaysian they are celebrating with.',
            'Run the same frame across offices in KL and regional branches.',
        ],
        faqs: [
            { q: 'When is Hari Merdeka?', a: 'August 31 every year, marking independence in 1957.' },
            { q: 'Is this the same as Malaysia Day?', a: 'No. Malaysia Day is September 16, marking the formation of Malaysia in 1963.' },
            { q: 'Do supporters need an app?', a: 'No. Ollabs works in the phone browser.' },
        ],
        relatedUseCases: ['schools', 'universities', 'companies', 'events'],
        relatedDays: ['hari-batik', 'sumpah-pemuda'],
    },
    {
        slug: 'philippines-bonifacio-day',
        name: 'Bonifacio Day',
        kind: 'day',
        date: { type: 'fixed', month: 11, day: 30 },
        colors: [
            { name: 'Philippines blue', hex: '#0038A8' },
            { name: 'Philippines red', hex: '#CE1126' },
        ],
        category: 'community',
        audience: ['Filipino communities', 'Schools', 'Historical societies', 'Diaspora groups'],
        keyword: 'bonifacio day profile picture frame',
        tagline: 'November 30, remembering Andres Bonifacio and the fight for independence.',
        intro: [
            'The Philippines observes Bonifacio Day on November 30, birth anniversary of Andres Bonifacio, a leader of the revolution against Spanish rule.',
            'Schools, historical groups and Filipino communities use the day for reflection and pride. One frame connects them under a single link.',
        ],
        background: [
            'Andres Bonifacio co-founded the Katipunan movement and is remembered as a father of the Philippine revolution.',
            'Bonifacio Day is a public holiday in the Philippines, distinct from Independence Day on June 12.',
        ],
        howToCelebrate: [
            { title: 'Read primary sources', body: 'Share a short excerpt or museum link beside your framed photo so the day is more than a colour change.' },
            { title: 'Name your barangay or city', body: 'Local specificity helps diaspora and home communities find each other.' },
            { title: 'Use Tagalog or English', body: 'Many families switch languages mid-conversation. Either works in the caption.' },
        ],
        howOrgsMark: [
            { title: 'Partner with schools', body: 'History classes can produce captions while your organisation supplies one shared frame.' },
            { title: 'Respect the history', body: 'Avoid treating Bonifacio as generic nationalism. Name what your group is commemorating.' },
        ],
        campaignIdeas: [
            'Blue and red frame with optional city or organisation name.',
            'Invite participants to name one freedom they are grateful for today.',
            'Link to a library talk or community programme the same week.',
        ],
        faqs: [
            { q: 'When is Bonifacio Day?', a: 'November 30 every year in the Philippines.' },
            { q: 'Who was Andres Bonifacio?', a: 'He co-founded the Katipunan and helped lead the revolution against Spanish colonial rule.' },
            { q: 'Is this Independence Day?', a: 'No. Philippine Independence Day is June 12. Bonifacio Day honours Bonifacio\'s birth anniversary.' },
        ],
        relatedUseCases: ['schools', 'nonprofits', 'events', 'awareness-campaigns'],
        relatedDays: ['unity-day', 'hispanic-heritage-month'],
    },
    {
        slug: 'thailand-national-day',
        name: 'Thailand National Day',
        kind: 'day',
        date: { type: 'fixed', month: 12, day: 5 },
        colors: [
            { name: 'Thailand blue', hex: '#2D2A4A' },
            { name: 'Thailand gold', hex: '#F4D03F' },
        ],
        category: 'community',
        audience: ['Thai communities', 'Schools', 'Cultural organisations', 'Businesses abroad'],
        keyword: 'thailand national day profile picture frame',
        tagline: 'December 5, Father\'s Day and National Day in Thailand.',
        intro: [
            'Thailand observes National Day on December 5, the birthday of King Bhumibol Adulyadej, also celebrated as Father\'s Day. Blue and yellow appear in civic and community events.',
            'A shared frame gives Thai associations, schools and businesses one link for coordinated profiles.',
        ],
        background: [
            'December 5 was the birthday of King Bhumibol, who reigned from 1946 to 2016. The date remains a national holiday and Father\'s Day.',
            'Blue is associated with the monarchy in Thailand; yellow marks Monday, the day of the King\'s birth.',
        ],
        howToCelebrate: [
            { title: 'Mark the day respectfully', body: 'National symbols in Thailand carry formal weight. Keep tone civic and community focused.' },
            { title: 'Include Father\'s Day', body: 'Many families combine national observance with thanking fathers and mentors.' },
            { title: 'Name your province or city', body: 'From Chiang Mai to Phuket to Bangkok diaspora groups, locality helps posts find their people.' },
        ],
        howOrgsMark: [
            { title: 'Coordinate Thai associations abroad', body: 'One frame across chapters in different countries still reads as one movement.' },
            { title: 'Pair with a community service project', body: 'Father\'s Day campaigns often include volunteering or fundraising beside the frame.' },
        ],
        campaignIdeas: [
            'Blue and gold frame with optional city name.',
            'Ask members to thank a mentor in the caption.',
            'Share one link across LINE groups and Facebook pages your community already uses.',
        ],
        faqs: [
            { q: 'When is Thailand National Day?', a: 'December 5, observed as National Day and Father\'s Day.' },
            { q: 'Why blue and yellow?', a: 'Blue is long associated with the monarchy; yellow marks Monday, the King\'s birth weekday.' },
            { q: 'Can we use this from outside Thailand?', a: 'Yes. Diaspora groups use the same link worldwide.' },
        ],
        relatedUseCases: ['schools', 'companies', 'events', 'nonprofits'],
        relatedDays: ['unity-day', 'hari-batik'],
    },
    {
        slug: 'philippines-independence-day',
        name: 'Philippines Independence Day',
        kind: 'day',
        date: { type: 'fixed', month: 6, day: 12 },
        colors: [
            { name: 'Philippines blue', hex: '#0038A8' },
            { name: 'Philippines red', hex: '#CE1126' },
        ],
        category: 'community',
        audience: ['Filipino communities', 'Schools', 'Diaspora groups', 'Historical societies'],
        keyword: 'philippines independence day profile picture frame',
        tagline: 'June 12, Araw ng Kalayaan, for Filipinos at home and abroad.',
        intro: [
            'The Philippines marks Independence Day on June 12, commemorating the 1898 declaration of independence from Spain.',
            'Blue and red show up in parades, schools and community events. One frame gives your group a single link for the day.',
        ],
        background: [
            'General Emilio Aguinaldo proclaimed Philippine independence in Kawit, Cavite on June 12, 1898.',
            'The date became the official Independence Day holiday in 1962, replacing July 4 which had marked independence from the United States.',
        ],
        howToCelebrate: [
            { title: 'Name your place', body: 'From Manila to Cebu to a diaspora city, specificity helps people find each other.' },
            { title: 'Learn the 1898 story', body: 'Share one fact beyond the flag colours so the post teaches as well as celebrates.' },
            { title: 'Use Tagalog or English', body: 'Many families switch languages mid-caption. Either works.' },
        ],
        howOrgsMark: [
            { title: 'Partner with schools', body: 'History classes can supply captions while your organisation supplies one shared frame.' },
            { title: 'Respect the history', body: 'Keep tone civic and community focused rather than generic nationalism.' },
        ],
        campaignIdeas: [
            'Blue and red frame with optional city or barangay name.',
            'Invite participants to name one freedom they are grateful for today.',
            'Pair the frame with a community event or fundraiser link.',
        ],
        faqs: [
            { q: 'When is Philippines Independence Day?', a: 'June 12 every year, Araw ng Kalayaan.' },
            { q: 'Is this the same as Bonifacio Day?', a: 'No. Bonifacio Day is November 30. Independence Day is June 12.' },
            { q: 'Do supporters need an account?', a: 'No. Open the link, add a photo, download.' },
        ],
        relatedUseCases: ['schools', 'nonprofits', 'events', 'awareness-campaigns'],
        relatedDays: ['philippines-bonifacio-day', 'unity-day'],
    },
];
