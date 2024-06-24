export interface Personnel {
  id: string;
  firstName: string;
  lastName: string;
  rank: string;
  dutyPosition: string;
  unit: string;
  phone: string;
  email: string;
}

export interface PersonnelLocation {
  personnelId: string;
  personnelName: string;
  currentLocation: string;
  assignedLocation: string;
  comments: string;
  lastUpdated: string;
}

export interface PersonnelRank {
  name: string;
  title: string;
}

export const personnelRanks: PersonnelRank[] = [
  { name: "Guest", title: "Guest" },
  { name: "Civilian", title: "Civ" },
  { name: "Contractor", title: "Ctr" },
  { name: "Mr", title: "Mr" },
  { name: "Ms", title: "Ms" },
  { name: "Airman Basic", title: "AB" },
  { name: "Airman", title: "Amn" },
  { name: "Airman First Class", title: "A1C" },
  { name: "Senior Airman", title: "SrA" },
  { name: "Staff Sergeant", title: "SSgt" },
  { name: "Technical Sergeant", title: "TSgt" },
  { name: "Master Sergeant", title: "MSgt" },
  { name: "Senior Master Sergeant", title: "SMSgt" },
  { name: "Chief Master Sergeant", title: "CMSgt" },
  { name: "Second Lieutenant", title: "2nd Lt" },
  { name: "First Lieutenant", title: "1st Lt" },
  { name: "Captain", title: "Capt" },
  { name: "Major", title: "Maj" },
  { name: "Lieutenant Colonel", title: "Lt Col" },
  { name: "Colonel", title: "Col" },
  { name: "Brigadier General", title: "Brig Gen" },
  { name: "Major General", title: "Maj Gen" },
  { name: "Lieutenant General", title: "Lt Gen" },
  { name: "General", title: "Gen" },
];