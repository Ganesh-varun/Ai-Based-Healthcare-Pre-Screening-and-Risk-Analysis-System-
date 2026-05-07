"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../db/index"));
const router = (0, express_1.Router)();
// MASSIVE SYMPTOM RECOGNITION DICTIONARY
const SYMPTOM_WEIGHTS = {
    // EMERGENCY (Critical Markers)
    'chest pain': 35, 'heart attack': 40, 'stroke': 40, 'unconscious': 40,
    'seizure': 35, 'cannot breathe': 35, 'breathless': 25, 'cardiac arrest': 40,
    'poisoning': 35, 'choking': 35, 'severe bleeding': 35, 'paralysis': 35,
    'unresponsive': 40, 'anaphylaxis': 40, 'blue lips': 40, 'bluish lips': 40,
    'major injury': 40, 'suicidal': 50, 'rapid breathing': 30, 'shortness of breath': 30,
    'crushing pain': 35, 'heavy bleeding': 30, 'unstable': 30,
    // HIGH RISK (Serious Markers)
    'difficulty breathing': 20, 'pneumonia': 12, 'severe pain': 10, 'high fever': 10,
    'sepsis': 20, 'confusion': 12, 'stiff neck': 12, 'bloody stool': 15,
    'meningitis': 20, 'dehydration': 10, 'fracture': 10, 'deep cut': 10,
    'abdominal pain': 8, 'severe vomiting': 10, 'intense pain': 10,
    'fainting': 15, 'blackout': 15, 'blurred vision': 10, 'sharp pain': 10,
    // MODERATE RISK (Standard Markers)
    'fever': 6, 'prolonged fever': 10, 'persistent cough': 8, 'vomiting': 6,
    'diarrhea': 6, 'dizziness': 6, 'nausea': 5, 'mild pain': 4,
    'rash': 5, 'sore throat': 4, 'headache': 5, 'earache': 5,
    'eye infection': 5, 'asthma flare': 12, 'burning sensation': 6,
    'itching': 4, 'skin rash': 6, 'body pain': 6, 'joint pain': 6,
    'stomach ache': 5, 'stomach pain': 6, 'lost of appetite': 5,
    // LOW RISK (Minor Markers)
    'cough': 2, 'cold': 1, 'fatigue': 3, 'chills': 3, 'sneezing': 1,
    'runny nose': 1, 'tiredness': 2, 'weakness': 3, 'muscle ache': 2, 'dry throat': 2,
    'watery eyes': 2, 'congestion': 2
};
// SYMPTOM-SPECIFIC PRECAUTIONS
const PRECAUTIONS = {
    // EMERGENCY
    'chest pain': [
        'Sit upright and stay calm – this helps reduce the workload on your heart.',
        'Avoid any physical exertion – do not walk or move unnecessarily.',
        'Seek emergency medical help immediately – every minute counts.',
        'Loosen any tight clothing around your neck or chest.',
        'Inform someone nearby about your symptoms and location.'
    ],
    'heart attack': [
        'Call emergency services immediately – do not attempt to drive yourself.',
        'Stay as still as possible to minimize heart strain.',
        'Loosen tight clothing to improve circulation and breathing.',
        'If conscious and not allergic, ask emergency dispatch if taking an aspirin is advised.',
        'Do not wait to see if the symptoms go away.'
    ],
    'stroke': [
        'Act FAST: Check Face drooping, Arm weakness, Speech difficulty, and Time to call emergency.',
        'Keep the person lying down and comfortable.',
        'Do not give any food or drink to avoid choking risks.',
        'Note the exact time when symptoms first appeared.',
        'Monitor breathing until help arrives.'
    ],
    'unconscious': [
        'Call for help immediately and alert nearby medical personnel.',
        'Check breathing and pulse – begin CPR if trained and no breathing is detected.',
        'Do not leave the person alone; stay until emergency services arrive.',
        'If breathing, place the person in the recovery position (on their side).',
        'Check for any medical ID bracelets or necklaces.'
    ],
    'seizure': [
        'Clear the area of sharp or hard objects to prevent injury.',
        'Protect the head by placing something soft under it.',
        'Place the person on their side after the shaking stops to keep the airway clear.',
        'Do not restrain the person or put anything in their mouth.',
        'Time the seizure – seek emergency help if it lasts more than 5 minutes.'
    ],
    'cannot breathe': [
        'Call emergency services immediately – extreme difficulty breathing is a critical emergency.',
        'Sit upright to help expand your lungs; do not lie flat.',
        'Do not exert yourself; remain as quiet and calm as possible.',
        'Use any prescribed rescue inhaler if you have one.',
        'Loosen any tight clothing around the neck and chest.'
    ],
    'breathless': [
        'Sit down and rest immediately in a comfortable position.',
        'Try pursed-lip breathing: inhale slowly through the nose, exhale slowly through pursed lips.',
        'Seek medical help if the breathlessness is sudden, severe, or persistent.',
        'Avoid environments with smoke, dust, or high humidity.',
        'Note if your breathlessness improves with rest.'
    ],
    'cardiac arrest': [
        'Call emergency services (SOS) immediately.',
        'Begin high-quality chest compressions (CPR) immediately at 100-120 bpm.',
        'Use an Automated External Defibrillator (AED) as soon as one is available.',
        'Continue CPR until professional help arrives or an AED directs you to stop.',
        'Ensure the person is on a firm, flat surface.'
    ],
    'poisoning': [
        'Call emergency services or a poison control center immediately.',
        'Identify the substance, the amount taken, and the time it occurred.',
        'Do not induce vomiting unless explicitly told to do so by a professional.',
        'If the substance is on the skin or eyes, flush with lukewarm water for 15 minutes.',
        'Keep the product container and label for medical reference.'
    ],
    'choking': [
        'Perform the Heimlich maneuver (abdominal thrusts) if trained.',
        'Encourage the person to cough forcefully if they are able to make sound.',
        'If the person becomes unconscious, start CPR and call emergency services.',
        'Do not attempt a "blind sweep" of the mouth if you cannot see the object.',
        'Seek medical evaluation even if the object is successfully removed.'
    ],
    'severe bleeding': [
        'Apply firm, direct pressure to the wound using a clean cloth or bandage.',
        'Elevate the injured area above the level of the heart if possible.',
        'Seek emergency help immediately; do not remove the original bandage if it soaks through.',
        'Apply a second bandage over the first one if necessary.',
        'Keep the victim lying down and warm to prevent shock.'
    ],
    'paralysis': [
        'Do not move the person – any movement could cause further spinal cord damage.',
        'Call emergency services immediately for a neurologic evaluation.',
        'Stay with the person and keep them calm and warm.',
        'Monitor for changes in breathing or consciousness.',
        'Note exactly which parts of the body are affected.'
    ],
    'unresponsive': [
        'Call emergency services immediately.',
        'Check for a pulse and breathing; begin CPR if necessary.',
        'Stay with the person and monitor their vital signs.',
        'Look for any evidence of injury or nearby medications/substances.',
        'Check for medical alert documentation or jewelry.'
    ],
    'anaphylaxis': [
        'Seek emergency help immediately – this is a life-threatening allergic reaction.',
        'Use an Epinephrine auto-injector (EpiPen) if available and prescribed.',
        'Lie the person flat with their legs raised if they feel faint.',
        'Avoid any further exposure to the allergen.',
        'Stay with the person until help arrives, as a second reaction can occur.'
    ],
    'blue lips': [
        'Provide oxygen if available and seek emergency help immediately.',
        'Keep the person warm and avoid any physical exertion.',
        'Monitor breathing rate and depth closely.',
        'Ensure the person is in a well-ventilated area.',
        'Describe the skin color and any breathing difficulty when calling for help.'
    ],
    'bluish lips': [
        'Provide supplemental oxygen if available.',
        'Call emergency services immediately as this indicates low blood oxygen.',
        'Keep the person warm and minimize movement.',
        'Loosen restrictive clothing around the neck and chest.',
        'Check if fingers and toes are also turning blue.'
    ],
    'major injury': [
        'Control any visible bleeding with direct pressure.',
        'Do not move the person if a neck, back, or head injury is suspected.',
        'Stay calm and reassure the injured person while waiting for help.',
        'Keep the person warm to help prevent shock.',
        'Cover the person with a blanket but do not give them anything to drink.'
    ],
    'suicidal': [
        'Contact a crisis hotline or emergency services immediately.',
        'Do not leave the person alone under any circumstances.',
        'Remove any means of harm, such as weapons or medications, from the area.',
        'Listen without judgment and encourage them to keep talking.',
        'Stay with them until help arrives or you can safely get them to a hospital.'
    ],
    'rapid breathing': [
        'Try to slow your breathing by focusing on steady, calm inhalations.',
        'Sit upright in a chair to help your chest expand.',
        'Seek medical attention, especially if accompanied by chest pain or fever.',
        'Avoid caffeine and nicotine, which can increase heart and breathing rates.',
        'Use a pulse oximeter if available to check oxygen saturation.'
    ],
    'shortness of breath': [
        'Sit up straight or lean forward slightly with your hands on your knees.',
        'Practice pursed-lip breathing or diaphragmatic breathing.',
        'Medical attention is required to determine the underlying cause.',
        'Avoid any air pollutants like smoke, dust, or heavy perfumes.',
        'Note if it happens during rest or only during physical activity.'
    ],
    'crushing pain': [
        'Call emergency services immediately as this is highly suggestive of a heart attack.',
        'Stay as still as possible; do not walk around or panic.',
        'Loosen clothing and ensure you have plenty of fresh air.',
        'Do not attempt to drive yourself to the hospital.',
        'Have someone monitor you until paramedics arrive.'
    ],
    'heavy bleeding': [
        'Apply constant, firm pressure with a clean cloth or sterile dressing.',
        'Elevate the wound above the heart to slow the flow of blood.',
        'Do not remove soaked bandages; add new ones on top.',
        'Seek emergency care immediately if bleeding does not stop.',
        'Keep the person warm and calm to reduce blood pressure.'
    ],
    'unstable': [
        'Lie down immediately in a safe, flat area to prevent falls.',
        'Avoid any movement or attempts to stand up until feeling steady.',
        'Call for assistance or emergency help if it persists.',
        'Check blood pressure and heart rate if equipment is available.',
        'Ensure you are in a cool, well-ventilated space.'
    ],
    // HIGH
    'difficulty breathing': [
        'Sit upright and lean forward slightly to help your lungs expand.',
        'Perform pursed-lip breathing to improve ventilation.',
        'Seek immediate medical evaluation from a specialist or ER.',
        'Avoid cold air or environmental triggers that worsen breathing.',
        'Note any wheezing or coughing associated with the difficulty.'
    ],
    'pneumonia': [
        'Ensure absolute bed rest to allow your body to fight the infection.',
        'Stay exceptionally well-hydrated with water and clear broths.',
        'Monitor your oxygen levels with a pulse oximeter if possible.',
        'Take medications exactly as prescribed by your doctor.',
        'Use a humidifier or inhale steam to help clear chest congestion.'
    ],
    'severe pain': [
        'Note the exact location, intensity, and any triggers for the pain.',
        'Rest and avoid any movement that exacerbates the pain.',
        'Consult a medical professional for appropriate diagnostic tests.',
        'Avoid self-medicating with strong painkillers before seeing a doctor.',
        'Apply ice or heat if you know the cause (e.g., muscle vs. inflammation).'
    ],
    'high fever': [
        'Apply tepid (lukewarm) sponging to the forehead and body.',
        'Monitor temperature every 2 hours and keep a record.',
        'Seek immediate medical help if temperature exceeds 103°F (39.4°C).',
        'Wear lightweight clothing and rest in a cool, ventilated room.',
        'Drink plenty of fluids to prevent dehydration from sweating.'
    ],
    'sepsis': [
        'This is a medical emergency requiring hospitalization – seek help now.',
        'Monitor for signs of confusion, extreme shivering, or mottled skin.',
        'Note any recent infections, surgeries, or wounds.',
        'Treatment often involves IV fluids and antibiotics in a clinical setting.',
        'Time is critical – do not delay seeking professional care.'
    ],
    'confusion': [
        'Stay in a safe, supervised environment to prevent accidents.',
        'Have a family member or friend monitor you continuously.',
        'Seek medical help immediately if this is a sudden change.',
        'Check for other symptoms like fever, headache, or weakness.',
        'Ensure consistent lighting to reduce disorientation.'
    ],
    'stiff neck': [
        'Rest your neck and avoid sudden or repetitive movements.',
        'Consult a doctor immediately if accompanied by high fever and headache.',
        'Apply a warm compress for muscle-related stiffness.',
        'Ensure you have a supportive pillow for sleeping.',
        'Avoid long periods of looking down at phones or computers.'
    ],
    'bloody stool': [
        'Consult a doctor immediately for a referral to a gastroenterologist.',
        'Stay well-hydrated and avoid any irritating foods or alcohol.',
        'Note the color of the blood (bright red vs. dark/tarry) and frequency.',
        'Keep a record of any accompanying abdominal pain or cramps.',
        'Do not use over-the-counter medications without medical advice.'
    ],
    'meningitis': [
        'Seek emergency medical consultation immediately – this is critical.',
        'Rest in a dark, quiet, and cool room while waiting for help.',
        'Watch for a stiff neck, sensitivity to light, and high fever.',
        'Prepare to provide details about recent vaccinations or exposures.',
        'Avoid contact with others to prevent potential spread.'
    ],
    'dehydration': [
        'Drink Oral Rehydration Salts (ORS) or clear fluids in small, frequent sips.',
        'Avoid caffeine, alcohol, and sugary drinks which worsen dehydration.',
        'Stay in a cool, shaded environment to minimize fluid loss.',
        'Monitor urine output – dark urine is a sign of continued dehydration.',
        'Seek medical help if unable to keep fluids down due to vomiting.'
    ],
    'fracture': [
        'Immobilize the affected limb using a splint or sling.',
        'Apply ice packs wrapped in a cloth to reduce swelling and pain.',
        'Keep the injured area elevated above the level of the heart.',
        'Do not attempt to "straighten" or move the bone yourself.',
        'Seek an X-ray evaluation as soon as possible.'
    ],
    'deep cut': [
        'Apply firm, direct pressure with a clean cloth for at least 15 minutes.',
        'Clean the surrounding area with mild soap and water once bleeding stops.',
        'Cover with a sterile bandage and seek medical attention for stitches.',
        'Monitor for signs of infection like redness, warmth, or pus.',
        'Check if your tetanus vaccination is up to date.'
    ],
    'abdominal pain': [
        'Rest in a comfortable position and avoid heavy or spicy meals.',
        'Try small sips of water or clear liquids; avoid solid foods if nauseous.',
        'Note the specific location (upper, lower, right, left) and type of pain.',
        'Seek help if pain is sudden, severe, or accompanied by fever.',
        'Do not take laxatives or pain relievers until evaluated by a doctor.'
    ],
    'severe vomiting': [
        'Take very small sips of clear fluids every few minutes.',
        'Wait at least 30-60 minutes after vomiting before trying to eat.',
        'Start with bland foods like crackers or plain rice when you can tolerate fluids.',
        'Seek medical care if you cannot keep fluids down for more than 12 hours.',
        'Monitor for signs of dehydration like dry mouth or dizziness.'
    ],
    'intense pain': [
        'Seek a medical consultation to diagnose the underlying issue.',
        'Rest the affected area completely to prevent further aggravation.',
        'Keep a log of the pain\'s onset, duration, and what makes it better or worse.',
        'Avoid heavy physical activity until cleared by a professional.',
        'Use over-the-the counter pain relief only if you have no contraindications.'
    ],
    'fainting': [
        'Lie down immediately with your legs raised above your head level.',
        'Ensure there is plenty of fresh air flow in the room.',
        'Rest fully until you feel completely recovered and steady.',
        'Hydrate once you are fully conscious and alert.',
        'Schedule a follow-up with a doctor to investigate the cause.'
    ],
    'blackout': [
        'Do not drive or operate machinery until cleared by a doctor.',
        'Consult a neurologist or primary care physician for a full evaluation.',
        'Note any triggers like standing up quickly, hunger, or stress.',
        'Record the duration and any symptoms felt before the blackout.',
        'Have someone stay with you to ensure your safety.'
    ],
    'blurred vision': [
        'Rest your eyes periodically and avoid straining with screens.',
        'Avoid driving or any activity requiring sharp vision until it clears.',
        'Ensure your environment has good, indirect lighting.',
        'Consult an ophthalmologist if the blurring is sudden or painful.',
        'Check your blood sugar if you are diabetic.'
    ],
    'sharp pain': [
        'Rest and avoid any movement or pressure on the painful area.',
        'Monitor for any worsening of the pain or new symptoms.',
        'Consult a doctor if the pain is deep, internal, or persistent.',
        'Note if the pain is triggered by breathing, movement, or touch.',
        'Apply a cold compress if the pain is external or musculoskeletal.'
    ],
    // MODERATE / LOW
    'fever': [
        'Drink plenty of water and clear fluids to stay well-hydrated.',
        'Get adequate rest to help your immune system fight the illness.',
        'Use a damp, cool cloth on your forehead to help lower your temperature.',
        'Wear light, breathable clothing and keep the room at a comfortable temperature.',
        'Eat light, nutritious meals like soup or fruit to maintain energy.'
    ],
    'prolonged fever': [
        'Seek a doctor\'s consultation if fever lasts more than 3 days.',
        'Maintain a consistent hydration schedule with water and juices.',
        'Keep a log of your temperature readings and any other symptoms.',
        'Continue resting even if you start to feel slightly better.',
        'Avoid strenuous physical activity until the fever has fully subsided.'
    ],
    'persistent cough': [
        'Gargle with warm salt water to soothe a scratchy or irritated throat.',
        'Use a humidifier in your room to keep the air moist and reduce coughing.',
        'Stay hydrated with warm teas, broth, or water throughout the day.',
        'Avoid irritants like cigarette smoke, strong perfumes, or cold air.',
        'Try sleeping with your head slightly elevated using an extra pillow.'
    ],
    'vomiting': [
        'Take small, frequent sips of water or an electrolyte drink.',
        'Stick to bland foods like dry crackers, toast, or plain rice.',
        'Avoid dairy, spicy foods, and fatty foods until you feel better.',
        'Rest in a semi-upright position to prevent further nausea.',
        'Wait for at least an hour after vomiting before attempting to eat.'
    ],
    'diarrhea': [
        'Drink Oral Rehydration Salts (ORS) to replace lost electrolytes.',
        'Eat soft, bland foods such as bananas, rice, applesauce, and toast (BRAT diet).',
        'Avoid dairy products, high-fiber foods, and sugary drinks for a few days.',
        'Wash your hands frequently to prevent the spread of any infection.',
        'Consult a doctor if diarrhea persists for more than 48 hours.'
    ],
    'dizziness': [
        'Sit or lie down immediately in a safe place to avoid falling.',
        'Avoid sudden movements of the head or standing up too quickly.',
        'Focus on a fixed point in the distance to help regain balance.',
        'Ensure you are well-hydrated and have eaten sufficiently.',
        'Note if the dizziness occurs with specific movements or positions.'
    ],
    'nausea': [
        'Sip on ginger tea or chew on a small piece of fresh ginger.',
        'Avoid strong smells, greasy foods, and heavy meals.',
        'Practice deep, slow breathing in a well-ventilated area.',
        'Try acupressure by pressing on the inside of your wrist.',
        'Rest in a quiet room with your head elevated.'
    ],
    'mild pain': [
        'Rest the affected area and avoid tasks that cause discomfort.',
        'Apply a cold compress for 15-20 minutes to reduce minor inflammation.',
        'Gentle movement or stretching may help if the pain is muscle-related.',
        'Ensure you are using proper posture when sitting or working.',
        'Monitor the pain to ensure it doesn\'t become more severe.'
    ],
    'rash': [
        'Avoid scratching or picking at the rash to prevent infection.',
        'Keep the affected skin area clean, dry, and exposed to air.',
        'Use mild, fragrance-free soap and lukewarm water for washing.',
        'Apply a cool, damp cloth for temporary relief from itching.',
        'Note any new soaps, lotions, or foods that might have caused it.'
    ],
    'sore throat': [
        'Gargle with warm salt water several times a day.',
        'Drink warm herbal teas with honey to soothe the throat lining.',
        'Suck on throat lozenges or hard candy to keep the throat moist.',
        'Use a humidifier to prevent the air from becoming too dry.',
        'Rest your voice and avoid speaking loudly or for long periods.'
    ],
    'headache': [
        'Rest in a quiet, dark, and cool room away from bright screens.',
        'Stay hydrated and ensure you haven\'t skipped any meals.',
        'Apply a cool compress to your forehead or the back of your neck.',
        'Practice relaxation techniques or deep breathing exercises.',
        'Identify and avoid triggers like caffeine, strong odors, or stress.'
    ],
    'earache': [
        'Apply a warm (not hot) compress to the outside of the affected ear.',
        'Rest in an upright position rather than lying flat to reduce pressure.',
        'Avoid getting water inside the ear while bathing or showering.',
        'Do not insert cotton swabs or any objects into the ear canal.',
        'Consult a doctor if there is any discharge or significant hearing loss.'
    ],
    'eye infection': [
        'Avoid rubbing or touching your eyes to prevent further irritation.',
        'Wash your hands frequently, especially before and after touching your face.',
        'Use a warm, clean compress for crusty discharge or a cool one for itching.',
        'Discard or thoroughly clean any eye makeup or contact lenses used.',
        'Seek medical advice if you experience eye pain or changes in vision.'
    ],
    'asthma flare': [
        'Use your prescribed rescue inhaler exactly as directed.',
        'Sit upright and try to remain calm to help your breathing.',
        'Move away from any obvious triggers like smoke, dust, or pets.',
        'Follow your personalized asthma action plan if you have one.',
        'Seek emergency help if the inhaler does not provide relief within minutes.'
    ],
    'burning sensation': [
        'Flush the affected area with cool, running water for 10-15 minutes.',
        'Avoid wearing tight or restrictive clothing over the area.',
        'Do not apply oils, butter, or ointments to a new burn.',
        'Keep the area clean and protected with a sterile, non-stick bandage.',
        'Consult a doctor if the burning is internal or affects a large area.'
    ],
    'itching': [
        'Apply a cool, damp compress or take a lukewarm bath.',
        'Avoid scratching, which can damage the skin and lead to infection.',
        'Wear loose-fitting, cotton clothing to minimize skin irritation.',
        'Use moisturizing lotions that are free of alcohol and fragrances.',
        'Identify and avoid any potential allergens or irritants.'
    ],
    'skin rash': [
        'Avoid scratching and keep the area clean with mild cleanser.',
        'Apply a thin layer of soothing, fragrance-free lotion or aloe vera.',
        'Wear breathable fabrics like cotton and avoid synthetic materials.',
        'Note if the rash is spreading or if you have a fever.',
        'Avoid using new or strong laundry detergents on your clothes.'
    ],
    'body pain': [
        'Get plenty of rest to allow your muscles and joints to recover.',
        'Take a warm bath with Epsom salts to relax sore muscles.',
        'Perform gentle stretching or light movement if you feel able.',
        'Ensure you are staying well-hydrated throughout the day.',
        'Maintain good posture and use ergonomic support when sitting.'
    ],
    'joint pain': [
        'Rest the affected joint and avoid activities that place stress on it.',
        'Apply heat for stiffness or ice for acute swelling and pain.',
        'Use a brace or wrap for support if recommended by a professional.',
        'Incorporate low-impact exercises like swimming or walking when recovered.',
        'Maintain a healthy weight to reduce pressure on weight-bearing joints.'
    ],
    'stomach ache': [
        'Eat light, bland foods like toast, crackers, or plain yogurt.',
        'Stay hydrated with small sips of water or peppermint tea.',
        'Avoid alcohol, caffeine, and heavy or greasy meals.',
        'Apply a warm heating pad to the abdomen for comfort.',
        'Rest in a comfortable position and avoid tight clothing.'
    ],
    'stomach pain': [
        'Opt for small, frequent meals consisting of easily digestible foods.',
        'Avoid spicy, acidic, or highly processed foods for a few days.',
        'Stay hydrated but avoid gulping large amounts of fluid at once.',
        'Keep track of when the pain occurs in relation to eating.',
        'Consult a doctor if the pain is severe, persistent, or localized.'
    ],
    'lost of appetite': [
        'Try eating small, frequent, and nutrient-dense snacks.',
        'Sip on smoothies, broths, or juices if you can\'t tolerate solid food.',
        'Consult a doctor if the loss of appetite lasts more than 3 days.',
        'Identify if stress, medication, or illness is affecting your hunger.',
        'Keep a food diary to monitor your actual intake.'
    ],
    'cough': [
        'Drink plenty of water and warm fluids to keep your throat moist.',
        'Try warm honey-lemon water to soothe your throat and suppress cough.',
        'Use cough drops or hard candy to relieve an occasional dry tickle.',
        'Avoid smoke and other environmental pollutants that trigger coughing.',
        'Rest your voice and try to breathe through your nose.'
    ],
    'cold': [
        'Drink plenty of warm fluids like tea, broth, and warm water.',
        'Get extra rest to help your body\'s immune system recover faster.',
        'Use saline nasal spray or drops to help clear a stuffy nose.',
        'Gargle with warm salt water if you also have a sore throat.',
        'Eat nutritious foods like chicken soup and vitamin-rich fruits.'
    ],
    'fatigue': [
        'Prioritize 7-9 hours of quality sleep each night.',
        'Stay well-hydrated and maintain a balanced diet for steady energy.',
        'Take short, planned breaks throughout the day to rest your mind.',
        'Avoid excessive caffeine or energy drinks, which can lead to a crash.',
        'Consider gentle exercise like a short walk to improve circulation.'
    ],
    'chills': [
        'Stay warm by layering your clothes and using blankets.',
        'Monitor your temperature closely for the development of a fever.',
        'Drink warm beverages to help raise your core body temperature.',
        'Rest in a comfortable, draft-free environment.',
        'Seek medical help if chills are accompanied by shaking or confusion.'
    ],
    'sneezing': [
        'Use a tissue to cover your nose and mouth when you sneeze.',
        'Wash your hands frequently to prevent spreading germs to others.',
        'Identify and avoid common allergens like dust, pollen, or pet dander.',
        'Use a saline nasal rinse to clear irritants from your nasal passages.',
        'Keep your living area well-ventilated and clean.'
    ],
    'runny nose': [
        'Stay hydrated by drinking plenty of water and clear fluids.',
        'Use a saline nasal spray or neti pot to flush out excess mucus.',
        'Keep tissues handy and blow your nose gently to avoid ear pressure.',
        'Apply a small amount of petroleum jelly to the nostrils if they get sore.',
        'Use a humidifier to keep the nasal passages from drying out.'
    ],
    'tiredness': [
        'Establish a regular sleep-wake schedule, even on weekends.',
        'Ensure your bedroom is dark, quiet, and at a cool temperature.',
        'Stay hydrated and avoid heavy meals close to bedtime.',
        'Limit screen time (phones, TV) for at least an hour before sleep.',
        'Incorporate light physical activity during the day to feel more alert.'
    ],
    'weakness': [
        'Rest immediately and avoid any heavy lifting or strenuous exertion.',
        'Consult a medical professional if the weakness is sudden or localized.',
        'Ensure you are getting enough calories and essential nutrients.',
        'Check your hydration levels and blood pressure if possible.',
        'Avoid standing for long periods if you feel faint or unsteady.'
    ],
    'muscle ache': [
        'Perform gentle, slow stretching to relieve muscle tension.',
        'Take a warm bath with Epsom salts to soothe aching muscles.',
        'Apply a heating pad or cold pack depending on the cause of the ache.',
        'Stay hydrated to prevent muscle cramps and promote recovery.',
        'Massage the affected area gently to improve blood flow.'
    ],
    'dry throat': [
        'Sip on warm fluids like herbal tea with honey throughout the day.',
        'Gargle with warm salt water to moisturize and soothe the throat.',
        'Use a humidifier in your room, especially while you sleep.',
        'Avoid talking excessively or shouting, which can dry out the throat.',
        'Avoid breathing through your mouth as much as possible.'
    ],
    'watery eyes': [
        'Avoid known allergens and irritants like smoke, wind, or pollen.',
        'Use over-the-counter artificial tears to soothe irritated eyes.',
        'Apply a cool, damp cloth over your closed eyes for comfort.',
        'Ensure your digital screens have blue light filters or take breaks.',
        'Wash your face and eyelids gently with mild, tear-free cleanser.'
    ],
    'congestion': [
        'Use steam inhalation from a bowl of hot water or a hot shower.',
        'Stay hydrated to help thin out the mucus in your sinuses.',
        'Sleep with your head elevated to help your nasal passages drain.',
        'Use a saline nasal spray several times a day.',
        'Apply a warm compress over your nose and forehead.'
    ],
};
// POST /api/risk/analyze
router.post('/analyze', async (req, res) => {
    try {
        const { symptoms, ageGroup } = req.body;
        if (!symptoms || symptoms.length < 3) {
            return res.status(400).json({ error: 'Please describe your symptoms in more detail (min 5 chars)' });
        }
        console.log(`🤖 Intelligence Analysis for [${ageGroup}]: "${symptoms}"`);
        const lowerInput = symptoms.toLowerCase();
        // 1. Dataset Search (Full-Text Search) - Optimized for speed
        const ftsQuery = `
            SELECT 
                name, 
                symptoms_text,
                ts_rank(search_vector, websearch_to_tsquery('english', $1)) as rank
            FROM diseases
            WHERE search_vector @@ websearch_to_tsquery('english', $1)
            ORDER BY rank DESC
            LIMIT 10;
        `;
        const ftsResult = await index_1.default.query(ftsQuery, [symptoms]);
        const ftsMatches = ftsResult.rows;
        // 2. Risk Scoring Logic
        let keywordScore = 0;
        const matchedKeywords = [];
        // Normalize input: remove punctuation and extra spaces
        const normalizedInput = lowerInput.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ").replace(/\s{2,}/g, " ");
        // Calculate keyword score with smarter fuzzy matching
        Object.entries(SYMPTOM_WEIGHTS).forEach(([keyword, weight]) => {
            const kw = keyword.toLowerCase();
            const regex = new RegExp(`\\b${kw}\\b`, 'i');
            // Check for exact word or substring
            if (normalizedInput.includes(kw) || regex.test(normalizedInput)) {
                keywordScore += weight;
                if (!matchedKeywords.includes(keyword))
                    matchedKeywords.push(keyword);
            }
        });
        let datasetBonus = 0;
        let topMatchName = 'None';
        // Dataset Context & Critical Matches
        const topMatch = ftsMatches[0];
        if (topMatch) {
            topMatchName = topMatch.name;
            const topName = topMatch.name.toLowerCase();
            const rank = parseFloat(topMatch.rank) || 0;
            // Critical disease bonuses (Escalates if match found in 192k records)
            const criticalDiseases = ['ebola', 'rabies', 'sepsis', 'cholera', 'meningitis', 'heart attack', 'stroke', 'aneurysm', 'organ failure', 'cardiac'];
            const seriousDiseases = ['pneumonia', 'malaria', 'typhoid', 'dengue', 'tuberculosis', 'covid', 'diabetes ketoacidosis', 'appendix'];
            if (criticalDiseases.some(d => topName.includes(d)))
                datasetBonus += 40;
            else if (seriousDiseases.some(d => topName.includes(d)))
                datasetBonus += 20;
            datasetBonus += (rank * 25); // Dataset rank weight
        }
        // Systemic Bonus for Multiple Symptoms
        let systemicBonus = 0;
        if (matchedKeywords.length >= 4) {
            systemicBonus = 15; // Realistic boost for 4 symptoms
        }
        else if (matchedKeywords.length >= 3) {
            systemicBonus = 8; // High boost
        }
        else if (matchedKeywords.length >= 2) {
            systemicBonus = 4;
        }
        const totalScore = keywordScore + datasetBonus + systemicBonus;
        console.log(`📊 Score Breakdown:
    - Keywords: ${keywordScore} ([${matchedKeywords.join(', ')}])
    - Dataset: ${datasetBonus.toFixed(1)} (Top: ${topMatchName})
    - Systemic: ${systemicBonus}
    - Total: ${totalScore.toFixed(1)}`);
        // 3. Final Risk Classification (REBALANCED THRESHOLDS)
        let riskLevel = 'low';
        // Explicit Emergency/High Keywords Override
        const isExplicitEmergency = matchedKeywords.some(kw => SYMPTOM_WEIGHTS[kw] >= 35);
        const isExplicitHigh = matchedKeywords.some(kw => SYMPTOM_WEIGHTS[kw] >= 18);
        if (totalScore >= 35 || isExplicitEmergency)
            riskLevel = 'emergency';
        else if (totalScore >= 15 || isExplicitHigh)
            riskLevel = 'high';
        else if (totalScore >= 6)
            riskLevel = 'moderate';
        else
            riskLevel = 'low';
        // Age-based escalation (Vulnerability Boost)
        if (ageGroup === 'geriatric' || ageGroup === 'pediatric') {
            if (riskLevel === 'low')
                riskLevel = 'moderate';
            else if (riskLevel === 'moderate')
                riskLevel = 'high';
            else if (riskLevel === 'high')
                riskLevel = 'emergency';
        }
        console.log(`  Scoring Details: Points=${totalScore.toFixed(1)} | Keywords=[${matchedKeywords.join(', ')}] | Level=${riskLevel.toUpperCase()}`);
        // 4. Format Response
        const suspectedConditions = [];
        const seenNames = new Set();
        ftsMatches.forEach(m => {
            const nameLower = m.name.toLowerCase();
            if (!seenNames.has(nameLower)) {
                seenNames.add(nameLower);
                const rankValue = parseFloat(m.rank) || 0;
                const confValue = Math.min((rankValue * 100) + 40, 99.2);
                suspectedConditions.push({
                    id: `fts-${m.name}-${Math.random()}`,
                    name: m.name,
                    description: m.symptoms_text.substring(0, 160).replace(/\r?\n|\r/g, " ") + '...',
                    matchConfidence: confValue.toFixed(1) + '%'
                });
            }
        });
        const pathwayMap = {
            'emergency': 'IMMEDIATE_EMERGENCY_CARE',
            'high': 'SPECIALIST_CONSULTATION',
            'moderate': 'URGENT_MEDICAL_ATTENTION',
            'low': 'ROUTINE_CHECKUP'
        };
        // Gather precautions grouped by symptom
        const suggestions = [];
        const addedSymptoms = new Set();
        matchedKeywords.forEach(kw => {
            if (PRECAUTIONS[kw] && !addedSymptoms.has(kw)) {
                suggestions.push({
                    symptom: kw,
                    advice: PRECAUTIONS[kw]
                });
                addedSymptoms.add(kw);
            }
        });
        // Add default suggestions if none matched
        if (suggestions.length === 0) {
            suggestions.push({
                symptom: 'General Wellness',
                advice: ['Rest and maintain a record of any new symptoms.', 'Monitor your condition for any changes.', 'Stay hydrated and eat light meals.']
            });
        }
        res.json({
            riskLevel,
            pathway: pathwayMap[riskLevel],
            suspectedConditions: suspectedConditions.slice(0, 5),
            suggestions: suggestions.slice(0, 5), // Limit number of symptoms shown
            analysisId: Date.now().toString(),
            debug: {
                score: totalScore.toFixed(1),
                matches: matchedKeywords,
                datasetCount: ftsMatches.length
            }
        });
    }
    catch (error) {
        console.error('❌ Risk Analysis Error:', error);
        res.status(500).json({ error: 'Failed to analyze symptoms. Please check server connection.' });
    }
});
exports.default = router;
