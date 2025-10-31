class MedicalTerminologyDetector {
  constructor() {
    this.detectedTerms = new Set();
    this.medicalDictionary = this.initializeDictionary();
  }

  initializeDictionary() {
    return {
      'hypertension': {
        spanish: 'Hipertensión',
        phonetic: 'ee-per-ten-SYOHN',
        definition: 'High blood pressure, a condition where the force of blood against artery walls is too high.',
        imageUrl: null
      },
      'diabetes': {
        spanish: 'Diabetes',
        phonetic: 'dee-ah-BEH-tes',
        definition: 'A chronic condition affecting how the body processes blood sugar (glucose).',
        imageUrl: null
      },
      'diabetes mellitus': {
        spanish: 'Diabetes Mellitus',
        phonetic: 'dee-ah-BEH-tes meh-LEE-toos',
        definition: 'A group of diseases that affect how the body uses blood sugar, resulting in too much sugar in the bloodstream.',
        imageUrl: null
      },
      'asthma': {
        spanish: 'Asma',
        phonetic: 'AHS-mah',
        definition: 'A respiratory condition causing difficulty breathing due to inflammation and narrowing of airways.',
        imageUrl: null
      },
      'pneumonia': {
        spanish: 'Neumonía',
        phonetic: 'neh-oo-moh-NEE-ah',
        definition: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid.',
        imageUrl: null
      },
      'bronchitis': {
        spanish: 'Bronquitis',
        phonetic: 'bron-KEE-tees',
        definition: 'Inflammation of the bronchial tubes, which carry air to and from the lungs.',
        imageUrl: null
      },
      'arthritis': {
        spanish: 'Artritis',
        phonetic: 'ar-TREE-tees',
        definition: 'Inflammation of one or more joints, causing pain and stiffness.',
        imageUrl: null
      },
      'stroke': {
        spanish: 'Derrame Cerebral / Accidente Cerebrovascular',
        phonetic: 'deh-RAH-meh seh-reh-BRAL',
        definition: 'A medical emergency when blood supply to part of the brain is blocked or a blood vessel bursts.',
        imageUrl: null
      },
      'heart attack': {
        spanish: 'Ataque Cardíaco / Infarto',
        phonetic: 'ah-TAH-keh kar-DEE-ah-koh',
        definition: 'A blockage of blood flow to the heart muscle, usually due to a blood clot.',
        imageUrl: null
      },
      'chest pain': {
        spanish: 'Dolor de Pecho',
        phonetic: 'doh-LOR deh PEH-choh',
        definition: 'Discomfort or pain in the chest area, which may indicate various cardiac or respiratory conditions.',
        imageUrl: null
      },
      'shortness of breath': {
        spanish: 'Falta de Aire / Dificultad para Respirar',
        phonetic: 'FAHL-tah deh AH-ee-reh',
        definition: 'Difficulty breathing or feeling unable to get enough air.',
        imageUrl: null
      },
      'nausea': {
        spanish: 'Náusea',
        phonetic: 'NAH-oo-seh-ah',
        definition: 'A feeling of sickness with an urge to vomit.',
        imageUrl: null
      },
      'vomiting': {
        spanish: 'Vómito',
        phonetic: 'VOH-mee-toh',
        definition: 'The forceful expulsion of stomach contents through the mouth.',
        imageUrl: null
      },
      'diarrhea': {
        spanish: 'Diarrea',
        phonetic: 'dee-ah-REH-ah',
        definition: 'Loose, watery stools occurring more frequently than normal.',
        imageUrl: null
      },
      'constipation': {
        spanish: 'Estreñimiento',
        phonetic: 'es-treh-nyee-mee-EN-toh',
        definition: 'Difficulty emptying the bowels, usually associated with hardened feces.',
        imageUrl: null
      },
      'fever': {
        spanish: 'Fiebre',
        phonetic: 'fee-EH-breh',
        definition: 'An elevation in body temperature above the normal range, typically indicating infection or illness.',
        imageUrl: null
      },
      'headache': {
        spanish: 'Dolor de Cabeza',
        phonetic: 'doh-LOR deh kah-BEH-sah',
        definition: 'Pain in the head or upper neck region.',
        imageUrl: null
      },
      'migraine': {
        spanish: 'Migraña',
        phonetic: 'mee-GRAH-nyah',
        definition: 'A severe recurring headache, often accompanied by visual disturbances and nausea.',
        imageUrl: null
      },
      'dizziness': {
        spanish: 'Mareo',
        phonetic: 'mah-REH-oh',
        definition: 'A sensation of spinning or loss of balance.',
        imageUrl: null
      },
      'fatigue': {
        spanish: 'Fatiga',
        phonetic: 'fah-TEE-gah',
        definition: 'Extreme tiredness resulting from mental or physical exertion or illness.',
        imageUrl: null
      },
      'antibiotic': {
        spanish: 'Antibiótico',
        phonetic: 'ahn-tee-bee-OH-tee-koh',
        definition: 'A medicine that inhibits the growth of or destroys microorganisms, used to treat bacterial infections.',
        imageUrl: null
      },
      'penicillin': {
        spanish: 'Penicilina',
        phonetic: 'peh-nee-see-LEE-nah',
        definition: 'An antibiotic used to treat various bacterial infections.',
        imageUrl: null
      },
      'amoxicillin': {
        spanish: 'Amoxicilina',
        phonetic: 'ah-mok-see-see-LEE-nah',
        definition: 'A penicillin antibiotic used to treat many different types of infections.',
        imageUrl: null
      },
      'ibuprofen': {
        spanish: 'Ibuprofeno',
        phonetic: 'ee-boo-proh-FEH-noh',
        definition: 'A nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.',
        imageUrl: null
      },
      'aspirin': {
        spanish: 'Aspirina',
        phonetic: 'ah-spee-REE-nah',
        definition: 'A medication used to reduce pain, fever, or inflammation.',
        imageUrl: null
      },
      'insulin': {
        spanish: 'Insulina',
        phonetic: 'een-soo-LEE-nah',
        definition: 'A hormone that regulates blood sugar levels, used as medication for diabetes.',
        imageUrl: null
      },
      'metformin': {
        spanish: 'Metformina',
        phonetic: 'met-for-MEE-nah',
        definition: 'An oral medication used to control blood sugar levels in type 2 diabetes.',
        imageUrl: null
      },
      'lisinopril': {
        spanish: 'Lisinopril',
        phonetic: 'lee-SEE-noh-preel',
        definition: 'A medication used to treat high blood pressure and heart failure.',
        imageUrl: null
      },
      'atorvastatin': {
        spanish: 'Atorvastatina',
        phonetic: 'ah-tor-vah-stah-TEE-nah',
        definition: 'A medication used to prevent cardiovascular disease and lower cholesterol.',
        imageUrl: null
      },
      'blood pressure': {
        spanish: 'Presión Arterial',
        phonetic: 'preh-see-OHN ar-teh-ree-AHL',
        definition: 'The pressure of blood pushing against the walls of arteries.',
        imageUrl: null
      },
      'blood sugar': {
        spanish: 'Azúcar en la Sangre / Glucosa',
        phonetic: 'ah-SOO-kar en lah SAHN-greh',
        definition: 'The concentration of glucose in the blood.',
        imageUrl: null
      },
      'cholesterol': {
        spanish: 'Colesterol',
        phonetic: 'koh-les-teh-ROHL',
        definition: 'A waxy substance found in blood, high levels can increase risk of heart disease.',
        imageUrl: null
      },
      'x-ray': {
        spanish: 'Radiografía',
        phonetic: 'rah-dee-oh-grah-FEE-ah',
        definition: 'An imaging test that uses radiation to create pictures of internal body structures.',
        imageUrl: null
      },
      'mri': {
        spanish: 'Resonancia Magnética',
        phonetic: 'reh-soh-NAHN-see-ah mag-NEH-tee-kah',
        definition: 'Magnetic Resonance Imaging, a test using magnetic fields to create detailed body images.',
        imageUrl: null
      },
      'ct scan': {
        spanish: 'Tomografía Computarizada',
        phonetic: 'toh-moh-grah-FEE-ah kom-poo-tah-ree-SAH-dah',
        definition: 'A computed tomography scan that combines X-ray images from different angles.',
        imageUrl: null
      },
      'ultrasound': {
        spanish: 'Ultrasonido / Ecografía',
        phonetic: 'ool-trah-soh-NEE-doh',
        definition: 'An imaging technique using sound waves to produce pictures of internal body structures.',
        imageUrl: null
      },
      'prescription': {
        spanish: 'Receta Médica',
        phonetic: 'reh-SEH-tah MEH-dee-kah',
        definition: 'A written order from a healthcare provider for medication or treatment.',
        imageUrl: null
      },
      'dosage': {
        spanish: 'Dosis',
        phonetic: 'DOH-sees',
        definition: 'The amount of medicine to be taken at one time or over a period.',
        imageUrl: null
      },
      'side effects': {
        spanish: 'Efectos Secundarios',
        phonetic: 'eh-FEK-tohs seh-koon-DAH-ree-ohs',
        definition: 'Unwanted or unexpected effects of medication or treatment.',
        imageUrl: null
      },
      'allergy': {
        spanish: 'Alergia',
        phonetic: 'ah-LEHR-hee-ah',
        definition: 'An immune system reaction to a substance that is typically harmless.',
        imageUrl: null
      },
      'fracture': {
        spanish: 'Fractura',
        phonetic: 'frak-TOO-rah',
        definition: 'A break in a bone.',
        imageUrl: null
      },
      'sprain': {
        spanish: 'Esguince',
        phonetic: 'es-GEEN-seh',
        definition: 'An injury to a ligament caused by excessive stretching or tearing.',
        imageUrl: null
      },
      'surgery': {
        spanish: 'Cirugía',
        phonetic: 'see-roo-HEE-ah',
        definition: 'A medical procedure involving an incision to repair or remove body parts.',
        imageUrl: null
      },
      'anesthesia': {
        spanish: 'Anestesia',
        phonetic: 'ah-nes-TEH-see-ah',
        definition: 'Medication used to prevent pain during surgery or medical procedures.',
        imageUrl: null
      }
    };
  }

  async detectTerms(text) {
    const lowerText = text.toLowerCase();
    const detectedTerms = [];

    const sortedTerms = Object.keys(this.medicalDictionary).sort((a, b) => b.length - a.length);

    for (const term of sortedTerms) {
      if (lowerText.includes(term)) {
        const termKey = `${term}`;

        if (!this.detectedTerms.has(termKey)) {
          this.detectedTerms.add(termKey);

          const termData = this.medicalDictionary[term];
          detectedTerms.push({
            english: term.charAt(0).toUpperCase() + term.slice(1),
            spanish: termData.spanish,
            phonetic: termData.phonetic,
            definition: termData.definition,
            imageUrl: termData.imageUrl
          });
        }
      }
    }

    return detectedTerms;
  }

  reset() {
    this.detectedTerms.clear();
  }

  addCustomTerm(english, spanish, phonetic, definition, imageUrl = null) {
    const key = english.toLowerCase();
    this.medicalDictionary[key] = {
      spanish,
      phonetic,
      definition,
      imageUrl
    };
  }
}
