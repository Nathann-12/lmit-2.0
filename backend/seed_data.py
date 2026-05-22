"""
Seed script to populate MongoDB with initial data for the Laboratory website.
Run: python seed_data.py
"""
import asyncio
import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


LAB_INFO = {
    "name": "Laboratory for Multiscale Innovative Technologies",
    "tagline": "Advancing Materials Science, Nanotechnology, and Smart Agriculture",
    "description": "A leading research facility dedicated to developing innovative solutions in materials science, nanotechnology, and advanced gas sensors for sustainable agriculture.",
    "email": "contact@multiscalelab.edu",
    "phone": "+1 (555) 123-4567",
    "address": "Department of Materials Science, University Research Building, Suite 301",
    "hero_background_image": "https://images.unsplash.com/photo-1576141546153-3e04370b5ff7",
}


RESEARCH_FOCUS = [
    {
        "id": 1,
        "title": "Nanotechnology",
        "description": "Exploring nanoscale materials and phenomena to develop next-generation sensors and devices with unprecedented sensitivity and specificity.",
        "image": "https://images.unsplash.com/photo-1656331797721-b593b8f00297",
        "keywords": ["Nanomaterials", "Quantum dots", "Nanocomposites"]
    },
    {
        "id": 2,
        "title": "Materials Science",
        "description": "Investigating novel material compositions and structures to enhance performance, durability, and functionality in real-world applications.",
        "image": "https://images.unsplash.com/photo-1745237497721-5e6c13a171ac",
        "keywords": ["Advanced ceramics", "Thin films", "Surface engineering"]
    },
    {
        "id": 3,
        "title": "Smart Agriculture Sensors",
        "description": "Developing advanced gas sensors for precision agriculture, enabling real-time monitoring of soil health, crop conditions, and environmental factors.",
        "image": "https://images.unsplash.com/photo-1627920769842-6887c6df05ca",
        "keywords": ["IoT sensors", "Environmental monitoring", "Precision farming"]
    },
    {
        "id": 4,
        "title": "Digital Agriculture",
        "description": "Integrating sensor networks with data analytics and machine learning to optimize agricultural practices and improve crop yields sustainably.",
        "image": "https://images.pexels.com/photos/5230957/pexels-photo-5230957.jpeg",
        "keywords": ["Data analytics", "Machine learning", "Sustainable farming"]
    }
]


PUBLICATIONS = [
    {
        "id": 1,
        "title": "Highly Sensitive Gas Sensors Based on Nanostructured Metal Oxides for Agricultural Applications",
        "authors": "Dr. Sarah Chen, Dr. Michael Rodriguez, Dr. Emily Watson",
        "year": 2024,
        "journal": "Advanced Materials Research",
        "doi": "10.1016/j.amr.2024.01.023",
        "pdf": "#"
    },
    {
        "id": 2,
        "title": "Multiscale Modeling of Nanomaterial-Enhanced Sensors for Environmental Monitoring",
        "authors": "Dr. Michael Rodriguez, Dr. James Kim, Dr. Sarah Chen",
        "year": 2024,
        "journal": "Nature Nanotechnology",
        "doi": "10.1038/nnano.2024.045",
        "pdf": "#"
    },
    {
        "id": 3,
        "title": "Real-Time Soil Health Monitoring Using IoT-Enabled Sensor Networks",
        "authors": "Dr. Emily Watson, Dr. Lisa Anderson, Dr. Sarah Chen",
        "year": 2023,
        "journal": "Precision Agriculture Journal",
        "doi": "10.1007/paj.2023.08.012",
        "pdf": "#"
    },
    {
        "id": 4,
        "title": "Novel Nanocomposite Materials for Enhanced Gas Detection Sensitivity",
        "authors": "Dr. James Kim, Dr. Michael Rodriguez",
        "year": 2023,
        "journal": "Journal of Materials Chemistry",
        "doi": "10.1039/c3tc01234a",
        "pdf": "#"
    },
    {
        "id": 5,
        "title": "Machine Learning Approaches for Predicting Crop Health from Sensor Data",
        "authors": "Dr. Lisa Anderson, Dr. Emily Watson, Dr. David Park",
        "year": 2023,
        "journal": "Agricultural Systems",
        "doi": "10.1016/j.agsy.2023.05.018",
        "pdf": "#"
    },
    {
        "id": 6,
        "title": "Sustainable Agriculture Through Advanced Sensor Technology: A Review",
        "authors": "Dr. Sarah Chen, Dr. David Park",
        "year": 2022,
        "journal": "Environmental Science & Technology",
        "doi": "10.1021/est.2022.06.234",
        "pdf": "#"
    }
]


LAB_MEMBERS = [
    {
        "id": 1,
        "name": "Dr. Sarah Chen",
        "title": "Principal Investigator & Lab Director",
        "image": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
        "bio": "Dr. Chen leads our multidisciplinary research team with over 15 years of experience in materials science and nanotechnology. Her work focuses on developing innovative sensor technologies for sustainable agriculture.",
        "research": ["Nanotechnology", "Gas sensors", "Materials characterization"],
        "email": "s.chen@multiscalelab.edu",
        "linkedin": "#",
        "scholar": "#",
        "cv_url": "",
    },
    {
        "id": 2,
        "name": "Dr. Michael Rodriguez",
        "title": "Senior Research Scientist",
        "image": "https://images.unsplash.com/photo-1707944745891-922795a805dd",
        "bio": "Dr. Rodriguez specializes in computational modeling and simulation of nanomaterial properties. His research bridges theory and experimental validation in sensor development.",
        "research": ["Computational modeling", "Nanomaterials", "Sensor optimization"],
        "email": "m.rodriguez@multiscalelab.edu",
        "linkedin": "#",
        "scholar": "#",
        "cv_url": "",
    },
    {
        "id": 3,
        "name": "Dr. Emily Watson",
        "title": "Research Scientist - Agricultural Systems",
        "image": "https://images.unsplash.com/photo-1707944745853-b86631676829",
        "bio": "Dr. Watson brings expertise in precision agriculture and IoT sensor networks. She focuses on translating laboratory innovations into practical agricultural solutions.",
        "research": ["Precision agriculture", "IoT systems", "Environmental monitoring"],
        "email": "e.watson@multiscalelab.edu",
        "linkedin": "#",
        "scholar": "#",
        "cv_url": "",
    },
    {
        "id": 4,
        "name": "Dr. James Kim",
        "title": "Postdoctoral Researcher",
        "image": "https://images.unsplash.com/photo-1581065178047-8ee15951ede6",
        "bio": "Dr. Kim conducts research on advanced material synthesis and characterization techniques. His work focuses on developing novel nanocomposites for enhanced sensor performance.",
        "research": ["Material synthesis", "Nanocomposites", "Thin film technology"],
        "email": "j.kim@multiscalelab.edu",
        "linkedin": "#",
        "scholar": "#",
        "cv_url": "",
    },
    {
        "id": 5,
        "name": "Dr. Lisa Anderson",
        "title": "Postdoctoral Researcher",
        "image": "https://images.pexels.com/photos/4031524/pexels-photo-4031524.jpeg",
        "bio": "Dr. Anderson specializes in data science and machine learning applications for agricultural technology. She develops algorithms for sensor data analysis and prediction.",
        "research": ["Machine learning", "Data analytics", "Smart farming"],
        "email": "l.anderson@multiscalelab.edu",
        "linkedin": "#",
        "scholar": "#",
        "cv_url": "",
    },
    {
        "id": 6,
        "name": "David Park",
        "title": "Ph.D. Candidate",
        "image": "https://images.pexels.com/photos/31880869/pexels-photo-31880869.jpeg",
        "bio": "David is pursuing his doctorate in materials engineering, focusing on the integration of gas sensors with wireless communication systems for agricultural monitoring.",
        "research": ["Wireless sensors", "System integration", "Field testing"],
        "email": "d.park@university.edu",
        "linkedin": "#",
        "scholar": "#",
        "cv_url": "",
    }
]


YOUTUBE_VIDEOS = [
    {
        "id": 1,
        "title": "Lab Overview",
        "description": "Introduction to our research in multiscale materials and smart agriculture sensors.",
        "youtube_url": "https://www.youtube.com/watch?v=LXb3EKWsInQ",
        "sort_order": 1,
    },
    {
        "id": 2,
        "title": "Nanotechnology Research Highlights",
        "description": "Recent advances in nanomaterial-based gas sensors.",
        "youtube_url": "https://www.youtube.com/watch?v=ysz5S6PUM-U",
        "sort_order": 2,
    },
]


NEWS = [
    {
        "id": 1,
        "title": "Lab Receives $2M Grant for Smart Agriculture Research",
        "date": "2024-08-15",
        "excerpt": "Our laboratory has been awarded a prestigious National Science Foundation grant to develop next-generation sensor networks for sustainable farming practices.",
        "image": "https://images.unsplash.com/photo-1576141546153-3e04370b5ff7"
    },
    {
        "id": 2,
        "title": "New Publication in Nature Nanotechnology",
        "date": "2024-07-22",
        "excerpt": "Dr. Rodriguez and team publish groundbreaking research on multiscale modeling of nanomaterial-enhanced sensors in the prestigious Nature Nanotechnology journal.",
        "image": "https://images.pexels.com/photos/8851786/pexels-photo-8851786.jpeg"
    },
    {
        "id": 3,
        "title": "Welcome to New Lab Members",
        "date": "2024-06-01",
        "excerpt": "We are excited to welcome two new postdoctoral researchers and three graduate students to our team this summer. Welcome aboard!",
        "image": "https://images.unsplash.com/photo-1707944745860-4615eb585a41"
    }
]


async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data (idempotent seed)
    await db.lab_info.delete_many({})
    await db.research_focus.delete_many({})
    await db.publications.delete_many({})
    await db.lab_members.delete_many({})
    await db.news.delete_many({})
    await db.youtube_videos.delete_many({})
    print("Cleared existing collections")
    
    # Insert lab info
    await db.lab_info.insert_one(dict(LAB_INFO))
    print(f"Inserted lab info")
    
    # Insert research focus
    await db.research_focus.insert_many([dict(item) for item in RESEARCH_FOCUS])
    print(f"Inserted {len(RESEARCH_FOCUS)} research focus areas")
    
    # Insert publications
    await db.publications.insert_many([dict(item) for item in PUBLICATIONS])
    print(f"Inserted {len(PUBLICATIONS)} publications")
    
    # Insert lab members
    ALUMNI = [
        {
            "id": 7,
            "name": "Dr. Sarah Connor",
            "title": "Former Postdoctoral Researcher",
            "image": "",
            "bio": "",
            "research": [],
            "email": "sarah@example.com",
            "linkedin": "",
            "scholar": "",
            "cv_url": "",
            "is_alumni": True,
            "current_workplace": "Senior Scientist at Google"
        },
        {
            "id": 8,
            "name": "James Smith",
            "title": "Former MSc Student",
            "image": "",
            "bio": "",
            "research": [],
            "email": "james@example.com",
            "linkedin": "",
            "scholar": "",
            "cv_url": "",
            "is_alumni": True,
            "current_workplace": "Engineer at NASA JPL"
        }
    ]
    await db.lab_members.insert_many([dict(item) for item in LAB_MEMBERS] + [dict(item) for item in ALUMNI])
    print(f"Inserted {len(LAB_MEMBERS) + len(ALUMNI)} lab members")
    
    # Insert news
    await db.news.insert_many([dict(item) for item in NEWS])
    print(f"Inserted {len(NEWS)} news items")

    # Insert YouTube videos
    await db.youtube_videos.insert_many([dict(item) for item in YOUTUBE_VIDEOS])
    print(f"Inserted {len(YOUTUBE_VIDEOS)} YouTube videos")
    
    print("\nDatabase seeding complete!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
