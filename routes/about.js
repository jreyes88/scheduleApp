var express = require('express');
var router = express.Router();

const boardOfDirectors = [
  {
    name: "Tyson Tuttle",
    company: "Silicon Labs",
    title: "KLRU Board Chair",
    executive: true
  },
  {
    name: "Sergio Alcocer",
    company: "Creative Community Leader",
    executive: false
  },
  {
    name: "James Aldrete",
    company: "Message Audience & Presentation",
    executive: false
  },
  {
    name: "Tom Ball",
    company: "Next Coast Ventures",
    executive: true
  },
  {
    name: "Laura H. Beckworth",
    company: "Hobby Communications, LLP",
    executive: true
  },
  {
    name: "Laura Beuerlein",
    company: "Heritage Title Company",
    executive: false
  },
  {
    name: "Mike Blue",
    company: "Ernst & Young LLP",
    title: "KLRU Board Treasurer",
    executive: true
  },
  {
    name: "Myra Bull",
    company: "ValentineHR",
    executive: false
  },
  {
    name: "Ross Buhrdorf",
    company: "CorpTech",
    executive: false
  },
  {
    name: "Christy Carpenter",
    company: "Non-Profit Leader & Advisor",
    executive: false
  },
  {
    name: "Ken Cho",
    company: "People Pattern",
    executive: false
  },
  {
    name: "Rudy Colmenero",
    company: "Vacek, Kiecke & Colmenero, LLP",
    executive: false
  },
  {
    name: "Virginia Cumberbatch",
    company: "Div. of Diversity & Comm. Engagement, University of Texas at Austin",
    executive: false
  },
  {
    name: "Denise Davis",
    company: "Davis Kaufman PLLC",
    executive: false
  },
  {
    name: "Susie Dudley",
    company: "Kuper Sotheby’s International Realty",
    executive: false
  },
  {
    name: "Rodney Gibbs",
    company: "Texas Tribune",
    executive: true
  },
  {
    name: "Tom Green",
    company: "Actor, Investor & Philanthropist",
    executive: true
  },
  {
    name: "Joe Hanson",
    company: "Science Writer/YouTube Educator",
    executive: false
  },
  {
    name: "Jordan Herman",
    company: "Baker Botts LLP",
    executive: false
  },
  {
    name: "Kalinda Howe",
    company: "(Ex Officio) Chair, KLRU Community Advisory Board",
    executive: false
  },
  {
    name: "Karen Kennard",
    company: "Greenberg Traurig, LLP",
    executive: true
  },
  {
    name: "Michael Klein",
    company: "Regions Bank",
    executive: false
  },
  {
    name: "Myra Leo",
    company: "K&L Gates LLP",
    title: "KLRU Board Secretary",
    executive: false
  },
  {
    name: "Jan Lindelow",
    company: "Investor & Philanthropist",
    executive: true
  },
  {
    name: "Michael Marin",
    company: "Boulette & Golden LLP",
    executive: true
  },
  {
    name: "Stacey A. Martinez",
    company: "Norton Rose Fulbright US LLP",
    executive: false
  },
  {
    name: "Chris Mattsson",
    company: "Mattsson-McHale Foundation",
    title: "KLRU Vice Chair",
    executive: true
  },
  {
    name: "Niraj Mehdiratta",
    company: "Apothecary Restaurant and Holy Mountain",
    executive: false
  },
  {
    name: "David A. Montoya",
    company: "The University of Texas School of Law Career Services",
    executive: false
  },
  {
    name: "Leo Munoz",
    company: "Comcast NBCUniversal, Texas and Chairman, Texas Cable Association",
    executive: false
  },
  {
    name: "Minh Hien Nguyen",
    company: "NTT DATA Services",
    executive: false
  },
  {
    name: "Nona Niland",
    company: "Niland Foundation",
    executive: false
  },
  {
    name: "Ryan Nixon",
    company: "Goshawk Global Investments LLC",
    executive: true
  },
  {
    name: "Bettye Nowlin",
    company: "Philanthropist and Civic Volunteer",
    executive: false
  },
  {
    name: "Claire Pinkerton",
    company: "Civic Volunteer",
    executive: false
  },
  {
    name: "Mellie Price",
    company: "Dell Medical School at the University of Texas at Austin",
    executive: false
  },
  {
    name: "Catherine Robb",
    company: "Haynes and Boone, LLP",
    title: "KLRU Immediate Past Chair",
    executive: true
  },
  {
    name: "Deanna Rodriguez",
    company: "Entergy",
    executive: true
  },
  {
    name: "Geronimo Rodriguez",
    company: "Seton Healthcare Family",
    executive: true
  },
  {
    name: "Manuel Rosso",
    company: "Food on the Table",
    executive: false
  },
  {
    name: "Yvette Ruiz",
    company: "JP Morgan Chase",
    executive: false
  },
  {
    name: "Joah Spearman",
    company: "Localeur",
    executive: true
  },
  {
    name: "Bill Stotesbery",
    company: "KLRU-TV, Austin PBS",
    executive: true
  },
  {
    name: "Carl Stuart",
    company: "Carl Stuart Investment Advisor, Inc",
    executive: true
  },
  {
    name: "Madge Vasquez",
    company: "St. David’s Foundation",
    executive: false
  },
  {
    name: "John Volkmann",
    company: "SeriecC (now Cunningham Collective)",
    executive: false
  },
  {
    name: "S. Craig Watkins",
    company: "College of Communications at The University of Texas at Austin",
    executive: false
  },
  {
    name: "Howard Yancy",
    company: "Zydeco Development",
    executive: false
  },
  {
    name: "Jeriad Zoghby, PhD",
    company: "Accenture Interactive",
    executive: false
  }
];

const administration = [
  {
    name: "Bill Stotesbery",
    email: "bstotesbery@klru.org",
    title: "Chief Executive Officer and General Manager",
    phone: "512.471.8564",
    mobile: "512.658.4503"
  },
  {
    name: "Melanie Blackman",
    email: "mblackman@klru.org",
    title: "Human Resources Manager",
    phone: "512.475.9031"
  },
  {
    name: "Lori Bolding",
    email: "lbolding@klru.org",
    title: "Senior Vice President – Development",
    phone: "512.232.6270"
  },
  {
    name: "Tom Gimbel",
    email: "tgimbel@klru.org",
    title: "Austin City Limits General Manager and CEO ACL Enterprises",
    phone: "512.475.9012"
  },
  {
    name: "Benjamin Kramer",
    email: "bkramer@klru.org",
    title: "Vice President, Educational Services",
    phone: "512.475.9050"
  },
  {
    name: "Sara Robertson",
    email: "srobertson@klru.org",
    title: "Vice President – Production and Technology",
    phone: "512.475.9062"
  },
  {
    name: "Maria Rodriguez",
    email: "mrodriguez@klru.org",
    title: "Senior Vice President – Programming",
    phone: "512.475.9029"
  },
  {
    name: "Maury Sullivan",
    email: "msullivan@klru.org",
    title: "Senior Vice President – Community Engagement",
    phone: "512.475.9087"
  },
  {
    name: "Pat Wertz",
    email: "pwertz@klru.org",
    title: "Chief Financial Officer",
    phone: "512.475.9011"
  },
];

const communityAdvisoryBoard = [
  {
    name: "Kalinda Howe",
    title: "Chair"
  },
  {
    name: "Denise D. Hernandez",
    title: "Chair Elect"
  },
  {
    name: "Jeff Knight",
    title: "Secretary"
  },
  {
    name: "Maria Patricia Barajas"
  },
  {
    name: "Alka Bhanot"
  },
  {
    name: "Devyn Collie"
  },
  {
    name: "Alicia Dean"
  },
  {
    name: "Charles Embry Foster, Jr."
  },
  {
    name: "Dr. Philip Eaglin"
  },
  {
    name: "Emafely Garcia"
  },
  {
    name: "Gil Garcia"
  },
  {
    name: "Trey Hamlett"
  },
  {
    name: "Christine Hoang"
  },
  {
    name: "Katie King"
  },
  {
    name: "Katie Kizziar"
  },
  {
    name: "Sumaiya M. Malik"
  },
  {
    name: "Robert Malina"
  },
  {
    name: "Andrea Genevieve Michnik"
  },
  {
    name: "Brion Oaks"
  },
  {
    name: "Pramod Patil"
  },
  {
    name: "Celeste Quesada"
  },
  {
    name: "PJ Raval"
  },
  {
    name: "Ted Rutherford"
  },
  {
    name: "Dr. Mario Sanchez"
  },
  {
    name: "Gissela SantaCruz"
  },
  {
    name: "Dustin Tahmahkera"
  },
  {
    name: "Yasmin Diallo Turk"
  },
  {
    name: "Monica Maldonado Williams"
  },
  {
    name: "Dr. Richard K. Yuen"
  },
  {
    name: "Bill Stotesbery, CEO and GM",
    klruMember: true
  },
  {
    name: "Maury Sullivan, Sr. VP – Community Engagement",
    klruMember: true
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about', {
    title: 'About KLRU',
    style: 'style',
    board: boardOfDirectors,
    admin: administration,
    cab: communityAdvisoryBoard
  });
});

module.exports = router;
