import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Ramesh Adhikari',
        image: doc1,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Adhikari is dedicated to providing preventive and holistic care to his patients with a focus on early diagnosis and personalized treatments.',
        fees: 800,
        address: {
            line1: 'Baneshwor Marg',
            line2: 'Kathmandu, Nepal'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Sita Sharma',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Sharma is committed to women’s health and well-being, offering compassionate care and modern treatment options.',
        fees: 1000,
        address: {
            line1: 'Putalisadak Road',
            line2: 'Kathmandu, Nepal'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Anjali Karki',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Karki focuses on treating a wide range of skin-related conditions with modern techniques and empathy.',
        fees: 700,
        address: {
            line1: 'New Road',
            line2: 'Pokhara, Nepal'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Binod Shrestha',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Shrestha provides specialized care for infants and children, focusing on growth, nutrition, and vaccination.',
        fees: 900,
        address: {
            line1: 'Bharatpur-10',
            line2: 'Chitwan, Nepal'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Bivasha Pokhrel',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Dhungana specializes in neurological oodisorders and is known for her patient-centered and evidence-based care.',
        fees: 1200,
        address: {
            line1: 'Basundhara',
            line2: 'Kathmandu, Nepal'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Prakash Joshi',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Joshi helps patients manage complex neurological issues through accurate diagnosis and personalized care plans.',
        fees: 1200,
        address: {
            line1: 'Biratnagar Road',
            line2: 'Morang, Nepal'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Kiran Maharjan',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Maharjan is dedicated to improving patient lifestyles through early detection and chronic illness management.',
        fees: 850,
        address: {
            line1: 'Sahid Gate',
            line2: 'Lalitpur, Nepal'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Anita Kunwar',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Kunwar is passionate about women’s reproductive health, offering advanced treatments and personal support.',
        fees: 1100,
        address: {
            line1: 'Bhaktapur Durbar Square',
            line2: 'Bhaktapur, Nepal'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Bimala Raut',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Raut delivers effective skincare solutions for all age groups, ensuring patient satisfaction and safety.',
        fees: 600,
        address: {
            line1: 'Manigram',
            line2: 'Rupandehi, Nepal'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Suresh Thapa',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Thapa specializes in the care of newborns and children, promoting healthy development and wellness.',
        fees: 950,
        address: {
            line1: 'Dharan Buspark',
            line2: 'Sunsari, Nepal'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Kritika Bista',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Bista combines clinical expertise with compassion to treat various neurological conditions effectively.',
        fees: 1300,
        address: {
            line1: 'Pulchowk',
            line2: 'Lalitpur, Nepal'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Sanjay Poudel',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Poudel offers treatment for stroke, epilepsy, and other neurological disorders with a focus on recovery.',
        fees: 1300,
        address: {
            line1: 'Kalanki Chowk',
            line2: 'Kathmandu, Nepal'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Rekha Neupane',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Neupane helps manage general health concerns and chronic illnesses through regular checkups and care.',
        fees: 850,
        address: {
            line1: 'Lagankhel',
            line2: 'Lalitpur, Nepal'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Pramod Rajbhandari',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Rajbhandari supports women’s reproductive health with tailored consultations and medical procedures.',
        fees: 1000,
        address: {
            line1: 'Boudha',
            line2: 'Kathmandu, Nepal'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Nisha Khadka',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Khadka provides advanced skin care and cosmetic solutions suited for all skin types.',
        fees: 700,
        address: {
            line1: 'Nayabazar',
            line2: 'Pokhara, Nepal'
        }
    },
]