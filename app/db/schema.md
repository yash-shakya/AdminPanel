### Tables
1. Admin
2. Notification
3. GuestLecture
4. Sponsors
5. Techspardha teams
6. Dev Team (new)
7. App Dev Team
8. Events

#### Admin

```js
type users = {
    user_email: User
}
type User = {
    admin: boolean,
    email: string,
    name: string,
    onBoard: boolean,
    picture: string,
    phone: string,
    role: "user" | "manager" | "admin"
    year: "Fresher" | "Sophomore" | "Pre-final Year" | "Final Year",
    registeredEvents19: {
        eventCategory_1: {
            eventName_1: string,
            eventName_2: string,
        },
        eventCategory_2: {
            eventName_1: string,
            eventName_2: string,
        }
    }
}
{
    username: string,
    password: hashedString
}
```

#### Notification

```js
type notification = {
    "some_number": {
        "notification": NotificationInfo,
        time: "1650011400000"
    }
}
type NotificationInfo = {
    android_channel_id: string,
    body: string,
    image: IMGBB | null,
    link: string,
    title: string,
    time: 1708027724493, // example
}
```

#### lectures

```js
type lectures = {
    date: string, //28th Jan
    desc: string,
    facebook: string,
    imageUrl: string,
    insta: string,
    linkedin: string,
    link: string,
    name: string,
    time: string    // 10:00 AM
}
```

#### Sponsors

```js
type sponsors = {
    sponsorName_1: {
        id_1: Sponsor;
        id_2: Sponsor;
    },
    sponsorName_2: {
        id_1: Sponsor;
        id_2: Sponsor;
    }
}

type Sponsor = {
    alt: string,
    imageUrl: IMGBB | null,
    name: string,
    targetUrl: string | IMGBB | null, // link to sponsor site, if not then image link
}
```

#### contacts

```js
type contacts = {
    societyName:{
        contacts: Contacts[],
        logo: string
    }
}

type Contacts = {
    imageUrl: string,
    name: string,
    post: string {Convenor/co-convenor}
}
```

#### Events

```js
type events = {
    eventCategory: {
        events: {
            eventName_1: Event,
            eventName_2: Event,
            eventName_3: Event
        },
        icon: string;
        imgUrl: string;
        index: number;
    }
}

type EventInfo = {
    endTime: 1650011400000;
    eventName: string;
    startTime: 1650011400000;
}
```

#### EventDescription

```js
type eventDescription = {
    eventCategory_1: {
        eventName_1: EventInfo,
        eventName_2: EventInfo,
    },
    eventCategory_2: {
        eventName_1: EventInfo,
        eventName_2: EventInfo,
    }
}


type EventInfo = {
    coordinators: Coordinators[],
    description: string,
    document: string, // used for whatsapp group invite links
    endTime: 1713141000000, // example
    eventCategory?: string,
    eventName: string, // we can remove this
    flagship: boolean,
    poster: IMGBB | null, //link
    rules: string[],
    startTime: 1713141000000, // example,
    venue: string
}

type Coordinators = {
    coordinator_name: string,
    coordinator_number: string
}
```

#### dev & app-Dev Team

```js
type aboutDevs = Dev[]

type aboutAppDevs = Dev[]
type Dev = {
    github: string;
    imageUrl: string;
    insta: string;
    linkedin: string;
    name: string;
    year: string;
}
```
