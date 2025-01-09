### Tables
1. Admin
2. Notification
3. GuestLecture
4. Sponsors
5. Techspardha teams
6. Dev Team (new) - banao
7. App Dev Team - banao
8. Events

#### Admin

js
{
    username: string,
    password: hashedString
}


#### Notification

js
{
    android_channel_id: string,
    body: string,
    image: string,
    link: string,
    title: string,
    time: 1708027724493, // example
}


#### GuestLecture

js
{
    date: string, //28th Jan
    desc: string,
    facebook: string,
    imageUrl: IMGBB | null;,
    insta: string,
    linkedin: string,
    link: string,
    name: string,
    time: string    // 10:00 AM
}


#### Sponsors

js
sponsorCategory_1: Sponsor[],   // hackathon partners, food, Coding, Digital,Fashion, Internship and learning
sponsorCategory_2: Sponsor[]


js
type Sponsor = {
    alt: string,
    imageUrl: IMGBB | null;,
    name: string,
    targetUrl: string, // link to sponsor site, if not then image link
}


#### Techspardha teams

js
{
    societyName:{
        contacts: [],
        logo: string
    }
}

type Contacts = {
    imageUrl: IMGBB | null;,
    name: string,
    post: string {Convenor/co-convenor}
}


#### Events

js
{
    eventCategory: {
        eventName_1: Event,
        eventName_2: Event,
        eventName_3: Event
    }
}

type event = {
    coordinators: Coordinators[],
    description: string,
    document: string, // used for whatsapp group invite links
    endTime: 1713141000000, // example
    eventCategory?: string,
    eventName: string, // we can remove this
    flagship: boolean,
    poster: string, //link
    rules: string[],
    startTime: 1713141000000, // example,
    venue: string
}

type Coordinators = {
    coordinator_name: string,
    coordinator_number: string
}
