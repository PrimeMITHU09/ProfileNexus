import { CountryOrigin } from '../types';

export interface OriginData {
  maleFirstNames: string[];
  femaleFirstNames: string[];
  lastNames: string[];
  cities: string[];
  states: string[];
  streetTypes: string[];
}

export const ORIGIN_NAMES: Record<CountryOrigin, OriginData> = {
  us: {
    maleFirstNames: [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
      'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
      'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
      'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
      'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Patrick', 'Raymond', 'Jack', 'Dennis', 'Jerry'
    ],
    femaleFirstNames: [
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
      'Lisa', 'Nancy', 'Betty', 'Sandra', 'Margaret', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
      'Carol', 'Amanda', 'Dorothy', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia',
      'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen',
      'Samantha', 'Katherine', 'Christine', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Catherine', 'Maria', 'Heather'
    ],
    lastNames: [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
      'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
      'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
    ],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'CO'],
    streetTypes: ['St', 'Ave', 'Blvd', 'Rd', 'Dr', 'Ln', 'Way', 'Ct', 'Pl']
  },
  uk: {
    maleFirstNames: [
      'Oliver', 'George', 'Harry', 'Noah', 'Jack', 'Leo', 'Arthur', 'Muhammad', 'Oscar', 'Charlie',
      'Jacob', 'Thomas', 'Henry', 'William', 'Alfie', 'Archie', 'Joshua', 'Alexander', 'Ethan', 'Lucas',
      'Mason', 'Logan', 'James', 'Benjamin', 'Samuel', 'Daniel', 'Elijah', 'Liam', 'Finley', 'Sebastian'
    ],
    femaleFirstNames: [
      'Olivia', 'Amelia', 'Isla', 'Ava', 'Mia', 'Ivy', 'Lily', 'Isabella', 'Rosie', 'Sophia',
      'Grace', 'Freya', 'Willow', 'Florence', 'Emily', 'Ella', 'Poppy', 'Evie', 'Charlotte', 'Phoebe',
      'Daisy', 'Sofia', 'Sienna', 'Alice', 'Harper', 'Ruby', 'Sophie', 'Evelyn', 'Maisie', 'Maya'
    ],
    lastNames: [
      'Smith', 'Jones', 'Taylor', 'Williams', 'Brown', 'Davies', 'Evans', 'Wilson', 'Thomas', 'Roberts',
      'Johnson', 'Lewis', 'Walker', 'Robinson', 'Wood', 'Thompson', 'Wright', 'White', 'Watson', 'Jackson',
      'Harrison', 'Green', 'Edwards', 'Hughes', 'Hall', 'Gray', 'Turner', 'Martin', 'Clarke', 'Cooper'
    ],
    cities: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Bristol', 'Edinburgh', 'Leeds', 'Sheffield', 'Newcastle'],
    states: ['Greater London', 'West Midlands', 'Greater Manchester', 'Merseyside', 'South Yorkshire', 'West Yorkshire', 'Tyne and Wear', 'Kent', 'Essex', 'Hampshire'],
    streetTypes: ['Street', 'Road', 'Avenue', 'Close', 'Lane', 'Drive', 'Way', 'Gardens', 'Crescent']
  },
  ca: {
    maleFirstNames: [
      'Liam', 'Noah', 'Jackson', 'Lucas', 'Oliver', 'Logan', 'Benjamin', 'Ethan', 'Jacob', 'William',
      'Alexander', 'James', 'Mason', 'Carter', 'Owen', 'Jack', 'Luke', 'Henry', 'Wyatt', 'Grayson'
    ],
    femaleFirstNames: [
      'Olivia', 'Emma', 'Charlotte', 'Ava', 'Sophia', 'Amelia', 'Chloe', 'Mia', 'Ella', 'Harper',
      'Aria', 'Maya', 'Evelyn', 'Hannah', 'Isla', 'Avery', 'Lily', 'Abigail', 'Mila', 'Emily'
    ],
    lastNames: [
      'Smith', 'Tremblay', 'Gagnon', 'Roy', 'Cote', 'Lavoie', 'Fortin', 'Bouchard', 'Gauthier', 'Morin',
      'Brown', 'Wilson', 'Lee', 'Johnson', 'Campbell', 'Martin', 'Macdonald', 'Taylor', 'White', 'Anderson'
    ],
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
    states: ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'],
    streetTypes: ['St', 'Ave', 'Blvd', 'Rd', 'Cres', 'Way', 'Dr', 'Ct']
  },
  in: {
    maleFirstNames: [
      'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Anaya', 'Aarohi', 'Aditya',
      'Rohan', 'Rahul', 'Amit', 'Aryan', 'Vikram', 'Dev', 'Arjun', 'Siddharth', 'Karan', 'Yash',
      'Raj', 'Varun', 'Nikhil', 'Prakash', 'Deepak', 'Sanjay', 'Sunil', 'Manish', 'Rajesh', 'Ravi'
    ],
    femaleFirstNames: [
      'Aadhya', 'Ananya', 'Kiara', 'Diya', 'Pari', 'Saanvi', 'Anushka', 'Ishani', 'Riya', 'Sneha',
      'Priya', 'Kavya', 'Pooja', 'Neha', 'Aarti', 'Shreya', 'Divya', 'Anjali', 'Deepika', 'Swati',
      'Meera', 'Roshni', 'Sunita', 'Preeti', 'Simran', 'Tanvi', 'Kritika', 'Richa', 'Nisha', 'Aastha'
    ],
    lastNames: [
      'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Shah', 'Mehta', 'Joshi', 'Rao',
      'Reddy', 'Nair', 'Pillai', 'Chowdhury', 'Roy', 'Das', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Bose',
      'Mishra', 'Pandey', 'Tiwari', 'Deshmukh', 'Kulkarni', 'Patil', 'Bhat', 'Hegde', 'Sengupta', 'Dutta'
    ],
    cities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur'],
    states: ['MH', 'DL', 'KA', 'TS', 'GJ', 'TN', 'WB', 'RJ', 'UP', 'MP'],
    streetTypes: ['Marg', 'Road', 'Street', 'Lane', 'Nagar', 'Colony', 'Path', 'Enclave']
  },
  de: {
    maleFirstNames: [
      'Ben', 'Paul', 'Finn', 'Leon', 'Jonas', 'Noah', 'Elias', 'Felix', 'Lukas', 'Louis',
      'Maximilian', 'Henry', 'Jakob', 'Emil', 'Anton', 'Theo', 'Julian', 'David', 'Moritz', 'Liam'
    ],
    femaleFirstNames: [
      'Emma', 'Mia', 'Hannah', 'Sofia', 'Emilia', 'Anna', 'Lina', 'Marie', 'Lea', 'Lena',
      'Laura', 'Clara', 'Johanna', 'Luisa', 'Nele', 'Lara', 'Charlotte', 'Lilly', 'Leni', 'Frieda'
    ],
    lastNames: [
      'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
      'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann'
    ],
    cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
    states: ['BE', 'HH', 'BY', 'NW', 'HE', 'BW', 'SN', 'NI', 'RP', 'SH'],
    streetTypes: ['Straße', 'Weg', 'Allee', 'Platz', 'Gasse', 'Ring']
  },
  fr: {
    maleFirstNames: [
      'Gabriel', 'Léo', 'Raphaël', 'Louis', 'Arthur', 'Jules', 'Lucas', 'Maël', 'Adam', 'Hugo',
      'Hugo', 'Gabin', 'Liam', 'Sacha', 'Paul', 'Nathan', 'Antoine', 'Ethan', 'Clément', 'Victor'
    ],
    femaleFirstNames: [
      'Jade', 'Louise', 'Emma', 'Alice', 'Ambre', 'Lina', 'Rose', 'Chloé', 'Mia', 'Léa',
      'Anna', 'Mila', 'Julia', 'Inès', 'Lou', 'Manon', 'Zoé', 'Agathe', 'Lola', 'Camille'
    ],
    lastNames: [
      'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
      'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard'
    ],
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille'],
    states: ['IDF', 'PAC', 'ARA', 'OCC', 'NAQ', 'GES', 'HDF', 'NOR', 'BRE', 'PDL'],
    streetTypes: ['Rue', 'Avenue', 'Boulevard', 'Place', 'Impasse', 'Allée', 'Chemin']
  },
  global: {
    maleFirstNames: [], // combine dynamically
    femaleFirstNames: [],
    lastNames: [],
    cities: ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Toronto', 'Berlin', 'Mumbai', 'Dubai', 'Singapore'],
    states: ['NY', 'LDN', 'TK', 'PAR', 'NSW', 'ON', 'BER', 'MH', 'DXB', 'SG'],
    streetTypes: ['St', 'Ave', 'Rd', 'Blvd', 'Way']
  }
};

export const EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'proton.me',
  'mailpro.org',
  'tempinbox.net',
  'fastmail.com',
  'zoho.com'
];

export const OCCUPATIONS = [
  'Software Engineer', 'Digital Marketer', 'Content Creator', 'Graphic Designer',
  'UI/UX Designer', 'Product Manager', 'Financial Analyst', 'Marketing Specialist',
  'Data Analyst', 'Entrepreneur', 'Photographer', 'Fitness Coach',
  'Sales Executive', 'E-commerce Specialist', 'Video Editor', 'Copywriter',
  'Project Manager', 'Social Media Manager', 'Consultant', 'Architect'
];

export const BIOS = [
  '✨ Creating positive vibes | Living life one day at a time 🌿',
  '💻 Tech enthusiast & creative builder | DM for collabs 📩',
  '🚀 Passionate about innovation, growth & continuous learning.',
  '🎨 Art, coffee & code | Exploring new horizons daily ☕',
  '🌍 Traveler | Storyteller | Embracing new adventures.',
  '📷 Capturing moments & memories | Fitness & wellness addict 💪',
  '🎯 Driven by vision & execution | Digital nomad life ✈️',
  '💡 Sharing insights on business, tech & personal growth.',
  '✨ Mindfulness, music & minimalist lifestyle 🎧',
  '🔥 Building the future | Passionate about design & strategy'
];

export const STREET_NAMES = [
  'Maple', 'Oak', 'Pine', 'Cedar', 'Elm', 'Washington', 'Park', 'Lake', 'Hill', 'Sunset',
  'River', 'Forest', 'Valley', 'Highland', 'Spring', 'Meadow', 'Lincoln', 'Main', 'Broadway', 'Willow'
];
