import type { Request, Response } from 'express';

/**
 * GET /api/reviews
 *
 * Returns the current ArtiZone Google reviews dataset.
 * Reviews are sourced from the live GBP fetch and kept up-to-date here.
 * To refresh: ask Airo to "refresh my Google reviews".
 */
const REVIEWS = [
  {
    reviewId: 'AbFvOqkuiozsKcbSiQN277IQxSoQs4BeiQekJuuZL4O5wAkQhDo-wfenvPeGK0ghZUxDWhNBulj9',
    reviewer: { displayName: 'Lateefa Zaid al Kilani', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIO3dSXjzVoo2ydL3uLsY4JkfxArO3qs1mrdlnCrygoZgNWNw=s120-c-rp-mo-br100' },
    starRating: 'ONE',
    comment: "The only good thing is the receptionist. I booked a package around a 1000 jd before my wedding to do my thighs and hips and they ruined my hips now I have a hip that is very obvious and a one you can barely see I don't recommend this clinic at all it's extremely expensive, they don't handle the responsibility of their mistake, unprofessional job I wish I could show the difference in my hips and instead of fixing they blamed me…..",
    createTime: '2026-06-11T00:42:31.133397Z',
    updateTime: '2026-06-11T00:42:31.133397Z',
  },
  {
    reviewId: 'AbFvOqn6j1nFQIwEdwbAnqBgXhnhkxRCe2iLOTRQ5uq2ZoZ-QKeVNdWB3f4-PB47YmxTubJGVEuQ',
    reviewer: { displayName: 'Rawan Farraj', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIGbLeUMBNAjPG7Fqu1Fc9zDEQqnGKzq7hdTpzpce1QgVHyTA=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    createTime: '2026-06-07T10:02:46.164297Z',
    updateTime: '2026-06-07T10:02:46.164297Z',
  },
  {
    reviewId: 'AbFvOqlmhAKRUe1eKD3K_0HS5hQ83rDHIksthGyU_JLEZ7Uikiv1aZLrVyZBUyEoQ2rSmIhfpG8O8w',
    reviewer: { displayName: 'raghad baniomar', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLpeeCsMi8uJQjtdRgj051KXIXc_d7N3T3015aSpDS1huxs5A=s120-c-rp-mo-ba12-br100' },
    starRating: 'ONE',
    comment: "معملتهم سيئة و كمان بوقعوا المراجع عندهم على اخلاء مسؤوليه الهم انه مو مسؤولين عن اي اشي بصير للمراجع بعد ما يخلص من عندهم علاج بكل اشي وهاد بدل على عدم كفاءة وقلة ثقة بالمنتجات الي بقدموها\n\n(Translated by Google)\nTheir treatment is poor, and they also make patients sign a waiver releasing them from liability for anything that happens to the patient after they finish their treatment. This indicates a lack of competence and a lack of confidence in the products they offer.",
    createTime: '2026-05-12T19:02:35.853776Z',
    updateTime: '2026-05-12T19:02:35.853776Z',
  },
  {
    reviewId: 'AbFvOqmLPUmu44oOVKRppaZCuh1XHq_T_VrWEG3NvFpk49SO2zqTjoklyD1t2jyeMD5xA4H0Ya4K',
    reviewer: { displayName: 'Abdullah Qabazard', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocL4Esg4_3eRU84bvEWPLze0PTINGWOk2z8zTTi9s8ZCsSQwfQ=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: "ماشاءالله عيادة ممتازة ونظيفه وستاف ممتاز بالاخص خبيرة البشرة سنا اداء مميز وشغل ممتاز تستاهل التكرار\n\n(Translated by Google)\nMasha'Allah, an excellent and clean clinic with outstanding staff, especially the skin expert, Sana. Her performance and work are exceptional. Deserving of a repeat visit.",
    createTime: '2026-01-08T13:11:24.195807Z',
    updateTime: '2026-01-08T13:11:24.195807Z',
  },
  {
    reviewId: 'AbFvOql3CO7-Pxat5sbD0RQrb53wE58DC83IAUdoSd54wixpHVUabI5V_WxkEr1o-sxuzPmWFvSkow',
    reviewer: { displayName: 'Jana Shaban', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIBzkSp8JFIfTv2lBeIrmWH5QAkYMeJRkkXKOwMPvQiulX1ZQ=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: 'In love with the staff, I had an amazing experience and will definitely keep coming. I would recommend to anyone looking to enhance their radiance',
    createTime: '2025-11-08T08:37:55.962320Z',
    updateTime: '2025-11-08T08:37:55.962320Z',
  },
  {
    reviewId: 'AbFvOqkzhvkm8SY6l0ExKLmbbe8PJHSEoDyR6Fu4yH6umDFhnyQTGQgxTvCSxOZcJpui8WXtcnCFIw',
    reviewer: { displayName: 'Aseel Abusamara', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKhf4Ned_Kpc5VimyBPTYQhNT_KObK1kxHniHUJ6utXYXIlFg=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: "Friendly helpful employees\nربحت جائزة جلسه و عملتها وكانوا صادقين وعملوا لصدقتي 😍😍😍 جد مرتبين  بنصح بشدة فيهم\n\n(Translated by Google)\nFriendly, helpful employees. I won a session prize and they were honest and helpful to my charity. 😍😍😍 They are very organized. I highly recommend them.",
    createTime: '2025-11-03T13:37:24.969327Z',
    updateTime: '2025-11-03T13:37:24.969327Z',
  },
  {
    reviewId: 'AbFvOql6ZS-fMFa6nFmiB-h9ixkIuf_PAosj-OrVFg20tvTj4wdAG0L7M5JmOzuUhtkpb76OMOKi2g',
    reviewer: { displayName: 'Reham Hamdan', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKNJNc16v7cnBjaonaN13cspgP3t-Z_CDvsuzB6OebH-NRxJw=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: "العيادة من افضل وارقى العيادات مصداقية وتعامل ونظافة ونتائج جد نتائج ، الفينوس خرافي ،،، طبعاً وجيهان بجنن\n\n(Translated by Google)\nThis clinic is one of the best and most prestigious in terms of credibility, service, cleanliness, and truly remarkable results. Venus is phenomenal, and of course, Jihan is amazing.",
    createTime: '2025-11-03T13:35:11.500744Z',
    updateTime: '2025-11-03T13:35:11.500744Z',
  },
  {
    reviewId: 'AbFvOql44064XSKjc3TBDjIW7TWZgyy9JHFpKWRcw06KmhVJwB08L-JYdAh-QtRZhPLjCFD8OdB8mA',
    reviewer: { displayName: 'Meme Malak', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIIos-cwRB7QWrARAelGbZmRPg1B6LA-o8rcHx0if7ZdnY_XA=s120-c-rp-mo-br100' },
    starRating: 'FIVE',
    comment: "I recently had a double chin treatment at Artizone, and I couldn't be happier with my experience! From the moment I walked in, the staff made me feel comfortable and well cared for. The clinic was clean, modern, and welcoming.\nMy practitioner was incredibly knowledgeable and explained every step of the procedure, which really helped ease my nerves. The treatment itself was quick, virtually painless, and I'm already seeing amazing results — my jawline looks more defined, and my confidence has definitely improved!\nI would highly recommend Artizone clinic to anyone considering cosmetic treatments. Thank you to the entire team especially Jehan and Aseel for such a wonderful experience!",
    createTime: '2025-10-30T14:16:49.686749Z',
    updateTime: '2025-10-30T14:16:49.686749Z',
  },
  {
    reviewId: 'AbFvOqkCFYtz1mO_TV_zX1rzqWl0QZaj1WmIEtQ42scVxHzdTR0W-_yoHMI1g-czyVy6Pb6nwh000g',
    reviewer: { displayName: 'Aseel Shehadeh', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIPaX1PoKFSVqU7weuwWYe8vY9-jxuNe7AoW0SACshPf2CXYA=s120-c-rp-mo-br100' },
    starRating: 'ONE',
    comment: "تعامل سيء\nاخدت موعد مع فيكتوريا الساعة ٣:٣٠ ووصلت عالموعد\nبعدها حكت انها دخلت تعمل جلسة لشخص تاني وانه لازم استنى ١٠ دقايق\nمر اكتر من نص ساعة وهي رفضت تطلع من الجلسة عشان تركبلي الجهاز\nفاستهتار بوقت ومصاري الناس\nوتعامل سيء\n\n(Translated by Google)\nTerrible service.\nI made an appointment with Victoria at 3:30 and arrived on time.\nThen she said she went in to do a session for someone else and that I had to wait 10 minutes.\nMore than half an hour passed and she refused to leave her session to install the device for me.\nThis is disrespectful of people's time and money.\nTerrific service.",
    createTime: '2025-10-26T13:29:59.803525Z',
    updateTime: '2025-10-26T13:29:59.803525Z',
  },
  {
    reviewId: 'AbFvOqkMFH3QwIZY_VOg1r9u2ovOC_4yMlqST_Kc3rdEdpFFGn6V6ofKCzAn0yzoMZ6l3kCSVy1aQw',
    reviewer: { displayName: 'Muna', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocItjnHtEvS04vWwR3_6ZYKEi54oLJnFCNPPTFR1qG0boWtoJg=s120-c-rp-mo-br100' },
    starRating: 'ONE',
    comment: 'Everything is a lie. They made my body worse than before I wish I never went',
    createTime: '2025-10-15T15:20:38.977693Z',
    updateTime: '2025-10-15T15:20:38.977693Z',
  },
];

export default async function handler(_req: Request, res: Response) {
  res.json({ reviews: REVIEWS });
}
