type Position =
  | "Software Developer"
  | "Frontend Developer"
  | "Backend Developer";

type CompanyEmails = {
  companyName: string;
  emails: string[];
};

const generateCoverLetter = (
  companyName: string,
  position: Position,
  companyEmails: CompanyEmails[]
) => {

    const emailTitle = `Application for ${position} position at ${companyName}`

  const coverLetter = `
        Assalamualaikum and a very day to you,

I've come across a share with regards to an open position at ${companyName} as a ${position}. I always remind myself, "If you don't try, then you'll guarantee won't get anything". So here I am.

I've been teaching myself programming for the past 3 years and currently in my last 2 months of internship at Regov Technologies Sdn Bhd out of 6 months as an Intern Backend Developer. I mostly come from the TypeScript and NodeJs world. However, I've also used Flutter and the Dart programming language in the past for my part time endeavour and final years university project.

Also, I'm a self taught Japanese speaker of Japanese with 8 years experience. I can express daily conversations comfortably. I also have some basic Chinese, in which I'm able to have basic Chinese conversation. I used to do photography and videography as a part time endeavour and also learned to play the piano.

The reason I'm telling you all of this is to illustrate and give a slight insight to my personality and traits, particularly in learning new things quickly and efficiently. Though it only gives a pixel of insight instead of the whole picture. So let's see the whole picture through our interview. I may not be the best in the block, but I can promise you, if given the chance, I will give you my all.

See you soon and have a good day

In the meantime, have a look at my website
    `;

companyEmails.forEach(company => {
    const { companyName, emails } = company;
    emails.forEach(email => {
        const mailLink = mailto(email, emailTitle, coverLetter)
    })
})
};

const mailto = (email: string, subject: string, body: string) => 
    `mailto:${email}?subject=${encodeURIComponent(
        subject)},body=${encodeURIComponent(body)};
    `

const openMailClient = (email: string, subject: string, body: string) => {
    const mailLink = mailto(email, subject, body)
    window.open(mailLink, '_blank');
}

const companies: CompanyEmails[] = [
  {
    companyName: "Connect World Inc",
    emails: ["ammarhazim.ayob@gmail.com"],
  },
];

generateCoverLetter("Connect World Inc", "Software Developer", companies);