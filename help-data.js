// English Colles in Lyon — Help skill bank, Lot 1
window.HELP_DATA = {
  "version": "1.0.0",
  "title": "Your Guided Learning Plan",
  "domains": {
    "grammar": {
      "label": "Grammar",
      "letter": "G",
      "colour": "#C46A4A"
    },
    "vocabulary": {
      "label": "Vocabulary",
      "letter": "V",
      "colour": "#D9A441"
    },
    "pronunciation": {
      "label": "Pronunciation",
      "letter": "P",
      "colour": "#3F7D7A"
    },
    "methodology": {
      "label": "Methodology",
      "letter": "M",
      "colour": "#243B53"
    },
    "civilisation": {
      "label": "Civilisation",
      "letter": "C",
      "colour": "#7A9B76"
    },
    "integrated": {
      "label": "Colle skills",
      "letter": "I",
      "colour": "#A65F7A"
    }
  },
  "stages": {
    "1": "Starting point",
    "2": "Building foundations",
    "3": "Working more independently",
    "4": "Building a colle",
    "5": "Precision and nuance"
  },
  "skills": [
    {
      "id": "G01",
      "domain": "grammar",
      "stage": 1,
      "order": 1,
      "title": "Recognise a complete sentence",
      "short": "Tell a complete sentence from a fragment.",
      "prereq": [],
      "source": null,
      "diagnostic": {
        "q": "Which group of words is a complete sentence?",
        "opts": [
          "Because the election was close.",
          "The election was close.",
          "After the election."
        ],
        "answer": 1,
        "feedback": "A complete sentence has a subject and a verb and can stand alone."
      },
      "mission": {
        "learn": [
          "A basic English sentence normally needs a subject and a verb.",
          "A group of words may contain useful information and still be incomplete."
        ],
        "model": "The government changed the law.",
        "commonError": "Because the government changed the law.",
        "practice": [
          {
            "q": "Choose the complete sentence.",
            "opts": [
              "The new policy affects students.",
              "Although the new policy.",
              "During the debate."
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Read aloud: “The new policy affects students.” Then replace “policy” with “decision”.",
        "useIt": "During your next class, make sure one of your answers contains a complete subject–verb sentence.",
        "check": {
          "q": "Which option can stand alone as a sentence?",
          "opts": [
            "When Parliament voted.",
            "Parliament voted yesterday.",
            "Because Parliament voted."
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You identified a complete sentence by checking for a subject, a verb and a complete idea. The next mission will make those two core parts easier to spot.",
          "partial": "You found the main idea, but one option was still a fragment. Check whether the words can stand alone.",
          "retry": "This distinction is not secure yet. Look for both a subject and a conjugated verb before trying again."
        }
      }
    },
    {
      "id": "G02",
      "domain": "grammar",
      "stage": 1,
      "order": 2,
      "title": "Identify the subject and the verb",
      "short": "Find who or what the sentence is about and what happens.",
      "prereq": [
        "G01"
      ],
      "source": null,
      "diagnostic": {
        "q": "In “The committee rejected the proposal”, what is the subject?",
        "opts": [
          "the committee",
          "rejected",
          "the proposal"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "The subject tells us who or what the sentence is about.",
          "The verb tells us what the subject does, is or experiences."
        ],
        "model": "The committee / rejected / the proposal.",
        "commonError": "Treating every noun as the subject.",
        "practice": [
          {
            "q": "In “Prices are rising”, what is the verb?",
            "opts": [
              "Prices",
              "are rising",
              "rising prices"
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say: “The committee rejected the proposal.” Stress the subject and the verb.",
        "useIt": "Underline the subject and the verb in one sentence from your next document.",
        "check": {
          "q": "In “Many workers oppose the reform”, which pair is correct?",
          "opts": [
            "subject: reform / verb: workers",
            "subject: workers / verb: oppose",
            "subject: many / verb: reform"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You can now separate the subject from the verb in a basic sentence. This gives you a reliable frame for building your own sentences.",
          "partial": "You located one core element correctly. Check who performs the action and which word carries the tense.",
          "retry": "Return to the model and mark who or what the sentence is about before looking for the verb."
        }
      }
    },
    {
      "id": "G03",
      "domain": "grammar",
      "stage": 1,
      "order": 3,
      "title": "Use the verb be",
      "short": "Choose the correct form of be in simple statements.",
      "prereq": [
        "G02"
      ],
      "source": null,
      "diagnostic": {
        "q": "Choose the correct sentence.",
        "opts": [
          "The figures is worrying.",
          "The figures are worrying.",
          "The figures be worrying."
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Use am with I, is with he/she/it and singular subjects, and are with you/we/they and plural subjects.",
          "The verb be can describe identity, state, location or a characteristic."
        ],
        "model": "The article is recent. The figures are worrying.",
        "commonError": "Using “is” with every subject.",
        "practice": [
          {
            "q": "Complete: “The article ___ about housing.”",
            "opts": [
              "am",
              "is",
              "are"
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say: “The article is recent. The figures are worrying.”",
        "useIt": "Use one correct sentence with be when introducing your next document.",
        "check": {
          "q": "Complete: “These institutions ___ important.”",
          "opts": [
            "is",
            "are",
            "am"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You selected the form of be that matches the subject. The next step is to keep that agreement when the sentence becomes longer.",
          "partial": "The meaning is clear, but subject–verb agreement still needs attention.",
          "retry": "Check whether the subject is singular or plural, then choose is or are."
        }
      }
    },
    {
      "id": "G04",
      "domain": "grammar",
      "stage": 1,
      "order": 4,
      "title": "Build basic English word order",
      "short": "Place the subject, verb and complement in a clear order.",
      "prereq": [
        "G02"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which sentence has correct basic word order?",
        "opts": [
          "Introduced the government a reform.",
          "The government a reform introduced.",
          "The government introduced a reform."
        ],
        "answer": 2,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "A common basic order is subject + verb + complement.",
          "English word order carries meaning, so moving words randomly often makes the sentence unclear."
        ],
        "model": "The government introduced a reform.",
        "commonError": "Copying French word order directly.",
        "practice": [
          {
            "q": "Put the idea in the clearest order.",
            "opts": [
              "Students need more support.",
              "Need students support more.",
              "More support students need."
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Read: “Students need more support.” Then change the subject to “Schools”.",
        "useIt": "Produce one subject + verb + complement sentence during your next class.",
        "check": {
          "q": "Choose the clearest sentence.",
          "opts": [
            "The report shows a sharp decline.",
            "Shows the report a sharp decline.",
            "A sharp decline the report shows."
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "Your sentence follows a clear English order. That makes the idea easier to understand even before you add more complex grammar.",
          "partial": "The correct words are present, but their order is still unstable.",
          "retry": "Start with who or what, then add the verb, then the information that completes the idea."
        }
      }
    },
    {
      "id": "G05",
      "domain": "grammar",
      "stage": 1,
      "order": 5,
      "title": "Build a negative sentence",
      "short": "Use not and the correct auxiliary.",
      "prereq": [
        "G03",
        "G04"
      ],
      "source": null,
      "diagnostic": {
        "q": "Choose the correct negative sentence.",
        "opts": [
          "The report not explains the cost.",
          "The report does not explain the cost.",
          "The report does not explains the cost."
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "With be, place not after the verb: is not / are not.",
          "With most present-simple verbs, use do not or does not + base verb."
        ],
        "model": "The policy is not popular. The report does not explain the cost.",
        "commonError": "Adding not without an auxiliary: “The report not explains”.",
        "practice": [
          {
            "q": "Make negative: “The figures are reliable.”",
            "opts": [
              "The figures do not reliable.",
              "The figures are not reliable.",
              "The figures not are reliable."
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say both sentences: “The policy is not popular. The report does not explain the cost.”",
        "useIt": "Use one negative sentence to qualify or challenge an idea in class.",
        "check": {
          "q": "Choose the correct form.",
          "opts": [
            "The article does not provide evidence.",
            "The article does not provides evidence.",
            "The article not provides evidence."
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You formed a negative sentence without changing the main verb incorrectly. You can now use negation to qualify an argument.",
          "partial": "The negative meaning is present, but the auxiliary or base verb still needs attention.",
          "retry": "After does not, use the base form of the verb. With be, place not directly after the verb."
        }
      }
    },
    {
      "id": "G06",
      "domain": "grammar",
      "stage": 1,
      "order": 6,
      "title": "Ask a simple question with be",
      "short": "Invert be and the subject.",
      "prereq": [
        "G03"
      ],
      "source": null,
      "diagnostic": {
        "q": "Choose the correct question.",
        "opts": [
          "Does the source is reliable?",
          "Is the source reliable?",
          "The source is reliable?"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "For a yes/no question with be, place the verb before the subject.",
          "Keep the rest of the sentence after the subject."
        ],
        "model": "Is the source reliable? Are the figures recent?",
        "commonError": "Adding do when be is already the main verb.",
        "practice": [
          {
            "q": "Turn into a question: “The figures are recent.”",
            "opts": [
              "Are the figures recent?",
              "Do the figures are recent?",
              "The figures are recent?"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Ask aloud: “Is the source reliable?” Then “Are the figures recent?”",
        "useIt": "Ask one simple clarification question with be during your next class.",
        "check": {
          "q": "Which question is correct?",
          "opts": [
            "Is the issue controversial?",
            "Does the issue is controversial?",
            "The issue is controversial?"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You placed be before the subject and produced a complete question. The next question pattern will use do or does.",
          "partial": "Your question is understandable, but the word order or extra auxiliary still needs attention.",
          "retry": "When be is the main verb, move it before the subject and do not add do."
        }
      }
    },
    {
      "id": "G07",
      "domain": "grammar",
      "stage": 1,
      "order": 7,
      "title": "Ask a question with do or does",
      "short": "Use do/does + subject + base verb.",
      "prereq": [
        "G04"
      ],
      "source": null,
      "diagnostic": {
        "q": "Choose the correct question.",
        "opts": [
          "Why does the policy matters?",
          "Why the policy matters?",
          "Why does the policy matter?"
        ],
        "answer": 2,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Use do with I/you/we/they and plural subjects. Use does with he/she/it and singular subjects.",
          "After do or does, the main verb stays in the base form."
        ],
        "model": "Why does the policy matter? Do voters support it?",
        "commonError": "Keeping the -s on the main verb after does.",
        "practice": [
          {
            "q": "Choose the correct form.",
            "opts": [
              "Do voters support the proposal?",
              "Does voters support the proposal?",
              "Do voters supports the proposal?"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Ask aloud: “Why does the policy matter?”",
        "useIt": "Prepare one question with do or does for your next class or colle discussion.",
        "check": {
          "q": "Which sentence is correct?",
          "opts": [
            "What does the author argues?",
            "What does the author argue?",
            "What the author does argue?"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You used the auxiliary and kept the main verb in the base form. This gives you a reliable pattern for asking analytical questions.",
          "partial": "The question pattern is almost correct, but check the auxiliary or the form of the main verb.",
          "retry": "Use do/does before the subject, then return the main verb to its base form."
        }
      }
    },
    {
      "id": "G08",
      "domain": "grammar",
      "stage": 1,
      "order": 8,
      "title": "Use the present simple",
      "short": "Describe facts, routines and general situations.",
      "prereq": [
        "G03",
        "G04"
      ],
      "source": null,
      "diagnostic": {
        "q": "Choose the correct sentence.",
        "opts": [
          "The Prime Minister lead the government.",
          "The Prime Minister leads the government.",
          "The Prime Minister leading the government."
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Use the present simple for facts, repeated actions and general situations.",
          "Add -s to the verb with he, she, it and singular subjects."
        ],
        "model": "Parliament passes laws. The Prime Minister leads the government.",
        "commonError": "Forgetting the third-person -s or adding it to plural subjects.",
        "practice": [
          {
            "q": "Choose the correct form.",
            "opts": [
              "Parliament pass laws.",
              "Parliament passes laws.",
              "Parliament is pass laws."
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say: “Parliament passes laws. Voters elect representatives.”",
        "useIt": "Use the present simple to explain one institution or general fact in your next colle.",
        "check": {
          "q": "Complete: “The article ___ a growing problem.”",
          "opts": [
            "describe",
            "describes",
            "is describe"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You used the present simple to state a general fact clearly. This form is now available for basic contextualisation.",
          "partial": "The tense is appropriate, but agreement with a singular subject still needs attention.",
          "retry": "For a singular third-person subject, add -s to the present-simple verb."
        }
      }
    },
    {
      "id": "V01",
      "domain": "vocabulary",
      "stage": 1,
      "order": 1,
      "title": "Understand basic activity instructions",
      "short": "Know what common task verbs ask you to do.",
      "prereq": [],
      "source": null,
      "diagnostic": {
        "q": "What does “match” ask you to do?",
        "opts": [
          "Write a long paragraph",
          "Connect corresponding items",
          "Translate every word"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Choose means select one answer. Match means connect corresponding items. Explain means make the meaning clear.",
          "Compare means identify similarities and differences; describe means state what something is like."
        ],
        "model": "Choose the answer. Match the terms. Explain your choice.",
        "commonError": "Starting an activity without identifying the instruction verb.",
        "practice": [
          {
            "q": "What does “explain” ask you to do?",
            "opts": [
              "Make an idea clear",
              "Copy the sentence",
              "Only give yes or no"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Read the instruction verbs aloud: choose, complete, match, explain, compare, describe.",
        "useIt": "Before your next task, underline the instruction verb and say in your own words what you must do.",
        "check": {
          "q": "What should you do when asked to “compare”?",
          "opts": [
            "Only describe the first item",
            "Identify similarities and differences",
            "Give a translation"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You identified what the instruction requires. That reduces avoidable mistakes before the language task even begins.",
          "partial": "You recognised part of the instruction, but the exact action is not yet secure.",
          "retry": "Focus on the first verb in the instruction and translate the action, not the whole sentence."
        }
      }
    },
    {
      "id": "V02",
      "domain": "vocabulary",
      "stage": 1,
      "order": 2,
      "title": "Identify the elements of a document",
      "short": "Use title, author, source, date and document type.",
      "prereq": [
        "V01"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which word tells you where a document was published?",
        "opts": [
          "source",
          "title",
          "date"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "The title names the document. The source tells you where it was published. The date places it in time.",
          "The author or speaker may help you assess viewpoint and purpose."
        ],
        "model": "This is a news article published by Reuters in May 2026.",
        "commonError": "Calling the title the source or treating the website name as the author.",
        "practice": [
          {
            "q": "Which element places the document in time?",
            "opts": [
              "author",
              "date",
              "headline colour"
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say: “This is an article published by … in …”",
        "useIt": "Use the five document words when preparing your next introduction.",
        "check": {
          "q": "In an introduction, which set is most useful?",
          "opts": [
            "title, source, date, type",
            "font, page number, colour",
            "every difficult word"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You can now name the basic elements that identify a document. The next step is to use them without confusing identification with context.",
          "partial": "Most document elements are clear, but one label is still being confused.",
          "retry": "Ask what each item answers: what is it called, who produced it, where, and when?"
        }
      }
    },
    {
      "id": "V03",
      "domain": "vocabulary",
      "stage": 1,
      "order": 3,
      "title": "Understand essential issue vocabulary",
      "short": "Use problem, change, decision, cause, consequence and debate.",
      "prereq": [
        "V01"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which word means “what happens as a result”?",
        "opts": [
          "cause",
          "consequence",
          "source"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "A cause explains why something happens. A consequence is what happens as a result.",
          "A debate involves disagreement or competing views; a policy is a planned course of action."
        ],
        "model": "The decision caused a public debate. One consequence was a rise in protests.",
        "commonError": "Using cause and consequence as if they meant the same thing.",
        "practice": [
          {
            "q": "A disagreement involving different views is a…",
            "opts": [
              "debate",
              "date",
              "summary"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say: “The decision had several consequences.”",
        "useIt": "Use cause or consequence once when discussing your next document.",
        "check": {
          "q": "Complete: “One ___ of the reform was higher costs.”",
          "opts": [
            "cause",
            "consequence",
            "author"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You distinguished a cause from a consequence and can use that distinction to structure an explanation.",
          "partial": "The general issue is understood, but the direction between cause and result still needs attention.",
          "retry": "Ask whether the word explains why something happened or what happened afterwards."
        }
      }
    },
    {
      "id": "V04",
      "domain": "vocabulary",
      "stage": 1,
      "order": 4,
      "title": "Use basic analysis verbs",
      "short": "Use show, explain, suggest, support, oppose and criticise.",
      "prereq": [
        "V02"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which verb is appropriately cautious?",
        "opts": [
          "proves",
          "suggests",
          "guarantees"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Analysis verbs help you describe what a document or speaker does.",
          "Choose a verb that matches the strength of the claim: suggests is weaker than proves."
        ],
        "model": "The article suggests that the reform may deepen inequality.",
        "commonError": "Using “prove” when the document only gives one example or opinion.",
        "practice": [
          {
            "q": "Complete: “The author ___ the government’s decision.”",
            "opts": [
              "criticises",
              "is criticism",
              "criticise is"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say: “The article suggests that…” and complete the sentence.",
        "useIt": "Replace “the text says” with one precise analysis verb in your next colle.",
        "check": {
          "q": "Which sentence is the most precise?",
          "opts": [
            "The text says stuff.",
            "The article criticises the policy.",
            "The document is about a thing."
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You selected a verb that describes the document’s action more precisely than “says”. This will make summaries and commentary clearer.",
          "partial": "The idea is understandable, but the analysis verb does not yet match the document’s strength or purpose.",
          "retry": "Choose what the author actually does: describe, explain, suggest, support, oppose or criticise."
        }
      }
    },
    {
      "id": "V05",
      "domain": "vocabulary",
      "stage": 1,
      "order": 5,
      "title": "Connect two simple ideas",
      "short": "Use and, but, because, so and however.",
      "prereq": [
        "V03"
      ],
      "source": null,
      "diagnostic": {
        "q": "Choose the correct connector: “The policy is controversial ___ it affects many workers.”",
        "opts": [
          "because",
          "however",
          "so"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Because introduces a reason. So introduces a result. But and however introduce contrast.",
          "However normally links two complete ideas and needs punctuation."
        ],
        "model": "The reform is costly, but supporters say it is necessary.",
        "commonError": "Using because to introduce a result or so to introduce a reason.",
        "practice": [
          {
            "q": "Choose the result connector: “Costs rose, ___ the government changed its plan.”",
            "opts": [
              "because",
              "so",
              "but"
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say both patterns: “X because Y.” “X, so Y.”",
        "useIt": "Use one reason connector and one contrast connector in your next spoken answer.",
        "check": {
          "q": "Complete: “The measure is popular; ___, it may be expensive.”",
          "opts": [
            "because",
            "however",
            "so"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You linked the ideas with a connector that shows the correct relationship. Your answer can now move beyond isolated sentences.",
          "partial": "Both ideas are present, but the connector does not yet express the intended relationship.",
          "retry": "Decide first: are you adding, contrasting, giving a reason or giving a result?"
        }
      }
    },
    {
      "id": "V06",
      "domain": "vocabulary",
      "stage": 1,
      "order": 6,
      "title": "Express an opinion and give a reason",
      "short": "Use a clear opinion frame without stopping at “I agree”.",
      "prereq": [
        "V05"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which answer contains an opinion and a reason?",
        "opts": [
          "I agree.",
          "I think the measure is unfair because it affects poorer families.",
          "The measure."
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "A useful basic pattern is: I think that… because…",
          "The reason should explain the opinion rather than simply repeat it."
        ],
        "model": "I think the measure is unfair because it affects low-income families most.",
        "commonError": "Giving an opinion with no reason.",
        "practice": [
          {
            "q": "Which phrase introduces a reason?",
            "opts": [
              "because",
              "in my opinion",
              "however"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say: “I think that … because …” and complete both parts.",
        "useIt": "Use the full opinion + reason pattern during your next discussion.",
        "check": {
          "q": "Which answer is complete?",
          "opts": [
            "In my opinion.",
            "I disagree because the evidence is weak.",
            "Because the evidence."
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You expressed a position and supported it with a reason. The answer is short, but it is complete and usable in discussion.",
          "partial": "Your position is clear, but the reason is missing or only repeats the opinion.",
          "retry": "Complete both halves of the pattern: what you think, then why."
        }
      }
    },
    {
      "id": "V07",
      "domain": "vocabulary",
      "stage": 1,
      "order": 7,
      "title": "Read dates, figures and percentages",
      "short": "Say key numerical information clearly.",
      "prereq": [
        "V01"
      ],
      "source": null,
      "diagnostic": {
        "q": "How is 35% read?",
        "opts": [
          "thirty-five per cent",
          "thirty-five percentage",
          "three five per cent"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Read 2024 as twenty twenty-four and 35% as thirty-five per cent in British English.",
          "Separate large numbers into groups and keep the final consonants audible."
        ],
        "model": "2,800 jobs; 35 per cent; in 2024.",
        "commonError": "Confusing thirteen and thirty or omitting per cent.",
        "practice": [
          {
            "q": "Which reading matches 2024?",
            "opts": [
              "two zero two four only",
              "twenty twenty-four",
              "two thousand and twenty-four only"
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say aloud: “In 2024, 35 per cent of respondents supported the plan.”",
        "useIt": "Select one useful figure from your next document and practise saying it before class.",
        "check": {
          "q": "Which phrase is correct?",
          "opts": [
            "2,800 job",
            "2,800 jobs",
            "2,800 of jobs"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You can state a date and a figure in a form your listener can follow. That makes evidence more useful in a spoken argument.",
          "partial": "The figure is understood, but one part of the spoken form still needs attention.",
          "retry": "Read the number in groups, then add the correct unit: jobs, people, pounds or per cent."
        }
      }
    },
    {
      "id": "P01",
      "domain": "pronunciation",
      "stage": 1,
      "order": 1,
      "title": "Make final consonants audible",
      "short": "Keep word endings clear enough to preserve meaning.",
      "prereq": [],
      "source": null,
      "diagnostic": {
        "q": "Which contrast depends on a final consonant?",
        "opts": [
          "work / worked",
          "see / sea",
          "two / too"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Final consonants often carry grammatical or lexical information: work/worked, vote/votes.",
          "Do not add an extra vowel after the final consonant."
        ],
        "model": "work / worked; vote / votes; risk / risks",
        "commonError": "Dropping the last sound or adding “-uh”.",
        "practice": [
          {
            "q": "Why do final consonants matter?",
            "opts": [
              "They can change tense or number.",
              "They are never heard.",
              "They only matter in spelling."
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say slowly, then naturally: work – worked; vote – votes; risk – risks.",
        "useIt": "Choose one final consonant target and monitor it in your next class or colle.",
        "check": {
          "q": "Which ending shows the past in “worked”?",
          "opts": [
            "the final /t/ sound",
            "an extra vowel",
            "no sound at all"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You kept the final sound that carries the tense or number. Your listener can now recover more of the grammatical information.",
          "partial": "The word is recognisable, but the ending is still too weak or followed by an extra vowel.",
          "retry": "Hold the word ending briefly, then release it without adding “uh”."
        }
      }
    },
    {
      "id": "P02",
      "domain": "pronunciation",
      "stage": 1,
      "order": 2,
      "title": "Distinguish W and V",
      "short": "Use lip shape and contact to separate the sounds.",
      "prereq": [],
      "source": null,
      "diagnostic": {
        "q": "For the /v/ sound, what touches the lower lip?",
        "opts": [
          "the tongue",
          "the top teeth",
          "nothing"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "For /w/, round the lips without touching the teeth. For /v/, the top teeth touch the lower lip.",
          "The difference is visible as well as audible."
        ],
        "model": "west / vest; wine / vine",
        "commonError": "Using the same lip position for both sounds.",
        "practice": [
          {
            "q": "Which pair practises W/V?",
            "opts": [
              "west / vest",
              "ship / sheep",
              "hat / at"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say: west – vest; wine – vine; welfare – very.",
        "useIt": "Use one word beginning with W and one with V in your next speaking task.",
        "check": {
          "q": "For /w/, the lips should be…",
          "opts": [
            "rounded without tooth contact",
            "pressed under the top teeth",
            "completely open"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You used a different mouth position for W and V. The contrast is now clearer and can be practised in connected speech.",
          "partial": "The two words are still close because the lip position did not change enough.",
          "retry": "Check the mirror: rounded lips for W; top teeth on lower lip for V."
        }
      }
    },
    {
      "id": "P03",
      "domain": "pronunciation",
      "stage": 1,
      "order": 3,
      "title": "Pronounce initial H",
      "short": "Release a small breath before the vowel.",
      "prereq": [],
      "source": null,
      "diagnostic": {
        "q": "Which word begins with a pronounced /h/?",
        "opts": [
          "honest",
          "housing",
          "hour"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "English /h/ is a breath sound at the start of words such as history, housing and healthcare.",
          "Do not replace it with silence when the word begins with pronounced H."
        ],
        "model": "history, housing, healthcare",
        "commonError": "Dropping H and saying “ousing”.",
        "practice": [
          {
            "q": "What creates the H sound?",
            "opts": [
              "a small breath",
              "teeth on the lip",
              "the tongue between the teeth"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Place a hand in front of your mouth and say: housing, history, healthcare.",
        "useIt": "Choose one key H-word from your next topic and make the initial breath audible.",
        "check": {
          "q": "Which pair should sound different?",
          "opts": [
            "housing / owing",
            "hour / our",
            "write / right"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You produced the initial breath that distinguishes the word clearly. Keep it light rather than forcing it.",
          "partial": "The word is understandable, but the initial H is still inconsistent.",
          "retry": "Begin with a gentle breath before the vowel; do not add a harsh throat sound."
        }
      }
    },
    {
      "id": "P04",
      "domain": "pronunciation",
      "stage": 1,
      "order": 4,
      "title": "Produce TH sounds",
      "short": "Place the tongue lightly between the teeth.",
      "prereq": [],
      "source": null,
      "diagnostic": {
        "q": "Where is the tongue for TH?",
        "opts": [
          "behind the lower lip",
          "lightly between the teeth",
          "on the roof of the mouth"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "For TH, the tongue tip is lightly visible between the teeth. Air passes around it.",
          "There is a voiced TH in this and an unvoiced TH in think."
        ],
        "model": "think / this; three / these",
        "commonError": "Replacing TH automatically with S, Z, T or D.",
        "practice": [
          {
            "q": "Which word contains an unvoiced TH?",
            "opts": [
              "this",
              "think",
              "very"
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say slowly: think – this – three – these. Then: “This issue affects three regions.”",
        "useIt": "Choose one frequent TH-word and use it deliberately in class.",
        "check": {
          "q": "Which pair contains the two TH sounds?",
          "opts": [
            "think / this",
            "west / vest",
            "ship / sheep"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You used the tongue position that creates TH instead of replacing it with another consonant. The next step is to keep it in a full sentence.",
          "partial": "The intended word is recognisable, but TH is still being replaced inconsistently.",
          "retry": "Slow down, show the tongue tip briefly, then let the air pass before moving to the vowel."
        }
      }
    },
    {
      "id": "P05",
      "domain": "pronunciation",
      "stage": 1,
      "order": 5,
      "title": "Pronounce plural and third-person -s",
      "short": "Use /s/, /z/ or /ɪz/ according to the final sound.",
      "prereq": [
        "P01"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which word ends with an extra syllable /ɪz/?",
        "opts": [
          "works",
          "lives",
          "changes"
        ],
        "answer": 2,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "The ending may sound /s/ as in works, /z/ as in lives, or /ɪz/ as in changes.",
          "The spelling is the same, but the pronunciation changes."
        ],
        "model": "works /s/; lives /z/; changes /ɪz/",
        "commonError": "Pronouncing every -s ending as /s/.",
        "practice": [
          {
            "q": "Which word ends with /z/?",
            "opts": [
              "lives",
              "works",
              "facts"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say: works, lives, changes. Then: “The reform changes lives.”",
        "useIt": "Monitor one plural or third-person -s ending in your next spoken answer.",
        "check": {
          "q": "Which sentence contains both /ɪz/ and /z/ endings?",
          "opts": [
            "The reform changes lives.",
            "The report works.",
            "The fact matters."
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You preserved the ending and selected a pronunciation that fits the preceding sound. Grammatical number and agreement are now easier to hear.",
          "partial": "The ending is present, but its sound or extra syllable still needs attention.",
          "retry": "Listen to the final sound before -s: voiceless, voiced, or a sibilant requiring /ɪz/."
        }
      }
    },
    {
      "id": "P06",
      "domain": "pronunciation",
      "stage": 1,
      "order": 6,
      "title": "Pronounce -ed endings",
      "short": "Use /t/, /d/ or /ɪd/ without adding a syllable every time.",
      "prereq": [
        "P01"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which word has an extra /ɪd/ syllable?",
        "opts": [
          "worked",
          "changed",
          "decided"
        ],
        "answer": 2,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "-ed is /t/ after many voiceless sounds, /d/ after many voiced sounds, and /ɪd/ after /t/ or /d/.",
          "Only /ɪd/ adds a full extra syllable."
        ],
        "model": "worked /t/; changed /d/; decided /ɪd/",
        "commonError": "Saying work-ed as two syllables.",
        "practice": [
          {
            "q": "How is the ending of “worked” pronounced?",
            "opts": [
              "/t/",
              "/d/",
              "/ɪd/"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say: worked, changed, decided. Then: “The government decided and changed the policy.”",
        "useIt": "Choose one past-tense verb from your next document and practise its ending.",
        "check": {
          "q": "Which pair is correctly grouped?",
          "opts": [
            "worked /t/ and decided /ɪd/",
            "worked /ɪd/ and decided /t/",
            "changed /ɪd/ and decided /d/"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You pronounced the past ending without creating an unnecessary syllable. The time reference is now easier to hear.",
          "partial": "The past ending is audible, but the selected sound or number of syllables still needs attention.",
          "retry": "Only add /ɪd/ after a /t/ or /d/ sound; otherwise use a short /t/ or /d/ ending."
        }
      }
    },
    {
      "id": "P07",
      "domain": "pronunciation",
      "stage": 1,
      "order": 7,
      "title": "Stress key words and speak in chunks",
      "short": "Group words by meaning instead of reading one word at a time.",
      "prereq": [
        "P01"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which words normally carry the strongest stress?",
        "opts": [
          "content words",
          "every article",
          "every preposition"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Stress content words that carry the main information. Reduce less important grammar words.",
          "Pause at meaning boundaries, not after every word."
        ],
        "model": "The NEW policy / could AFFECT thousands of WORKERS.",
        "commonError": "Giving every word equal weight and pausing randomly.",
        "practice": [
          {
            "q": "Where is the best pause?",
            "opts": [
              "The new policy / could affect thousands of workers.",
              "The / new / policy / could / affect…",
              "The new / policy could affect / thousands…"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say in two chunks: “The new policy / could affect thousands of workers.”",
        "useIt": "Mark two meaning groups in one sentence from your next presentation and practise them aloud.",
        "check": {
          "q": "Which delivery is clearest?",
          "opts": [
            "equal stress on every word",
            "meaning groups with key-word stress",
            "a pause after every word"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You organised the sentence around meaning rather than individual words. This improves clarity without requiring a different accent.",
          "partial": "The key words are becoming clearer, but the pauses still interrupt the meaning.",
          "retry": "Underline the information words, then draw one slash only where the idea naturally divides."
        }
      }
    },
    {
      "id": "C01",
      "domain": "civilisation",
      "stage": 1,
      "order": 1,
      "title": "Locate the main English-speaking countries",
      "short": "Recognise the eight country areas used on the site.",
      "prereq": [],
      "source": null,
      "diagnostic": {
        "q": "Which country is one of the eight Civilisation Lab areas?",
        "opts": [
          "Brazil",
          "New Zealand",
          "Germany"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "The Civilisation Lab covers the United Kingdom, the United States, Ireland, Canada, Australia, New Zealand, India and South Africa.",
          "The goal is not just location: each country provides a context for documents and debates."
        ],
        "model": "UK · US · Ireland · Canada · Australia · New Zealand · India · South Africa",
        "commonError": "Reducing the English-speaking world to the UK and US.",
        "practice": [
          {
            "q": "Which pair is included?",
            "opts": [
              "India and South Africa",
              "Spain and Portugal",
              "Japan and China"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say the eight country names aloud, grouping them by region.",
        "useIt": "Before your next document, identify the country and locate it on a map.",
        "check": {
          "q": "Which list contains only countries covered by the Civilisation Lab?",
          "opts": [
            "Canada, India, Ireland",
            "France, Canada, India",
            "Germany, Ireland, Australia"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You identified the wider set of countries used on the site. The next step is to connect each country with institutions and tensions rather than isolated facts.",
          "partial": "Most areas are recognised, but the full English-speaking scope is not yet secure.",
          "retry": "Review the eight country names and group them geographically before trying again."
        }
      }
    },
    {
      "id": "C02",
      "domain": "civilisation",
      "stage": 1,
      "order": 2,
      "title": "Distinguish a monarchy from a republic",
      "short": "Identify the basic form of head of state.",
      "prereq": [
        "C01"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which country is a constitutional monarchy?",
        "opts": [
          "United Kingdom",
          "Ireland",
          "South Africa"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "A monarchy has a monarch as head of state. A republic has a president or another non-hereditary head of state.",
          "A constitutional monarchy can still be a parliamentary democracy."
        ],
        "model": "The United Kingdom is a constitutional monarchy. Ireland is a republic.",
        "commonError": "Assuming monarchy means the monarch runs the government directly.",
        "practice": [
          {
            "q": "A republic normally has…",
            "opts": [
              "a hereditary monarch",
              "a non-hereditary head of state",
              "no institutions"
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say: “The United Kingdom is a constitutional monarchy, whereas Ireland is a republic.”",
        "useIt": "Use monarchy or republic accurately when contextualising a political document.",
        "check": {
          "q": "Which statement is correct?",
          "opts": [
            "A constitutional monarchy cannot be democratic.",
            "A republic has a hereditary monarch.",
            "A constitutional monarchy may have an elected parliament and government."
          ],
          "answer": 2,
          "feedback": ""
        },
        "feedback": {
          "success": "You distinguished the form of the head of state without confusing it with who runs the government.",
          "partial": "The country is recognised, but the distinction between head of state and head of government still needs attention.",
          "retry": "Ask whether the head of state is hereditary; then separate that role from day-to-day government."
        }
      }
    },
    {
      "id": "C03",
      "domain": "civilisation",
      "stage": 1,
      "order": 3,
      "title": "Distinguish a unitary state from a federation",
      "short": "Recognise where political powers are distributed.",
      "prereq": [
        "C01"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which country is a federation?",
        "opts": [
          "United States",
          "United Kingdom",
          "Ireland"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "In a federation, constitutional powers are divided between the federal level and constituent states or provinces.",
          "A unitary state may still devolve powers to regions, but Parliament remains constitutionally central."
        ],
        "model": "The United States and Canada are federations. The United Kingdom is a unitary state with devolution.",
        "commonError": "Treating devolution and federalism as identical.",
        "practice": [
          {
            "q": "What is true of a federation?",
            "opts": [
              "All power is local.",
              "Powers are constitutionally divided between levels.",
              "There is no national government."
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say: “Canada is a federation. The United Kingdom is a unitary state with devolved institutions.”",
        "useIt": "When a document concerns a state, province or devolved nation, identify which level of government is involved.",
        "check": {
          "q": "Which statement is most accurate?",
          "opts": [
            "Devolution and federalism are exactly the same.",
            "A unitary state can devolve powers.",
            "A federation has no central institutions."
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You identified how powers are distributed between national and regional levels. This will help you locate responsibility in political documents.",
          "partial": "The broad distinction is visible, but devolution and federalism are still being merged.",
          "retry": "Check whether regional powers are constitutionally shared or delegated within a unitary system."
        }
      }
    },
    {
      "id": "C04",
      "domain": "civilisation",
      "stage": 1,
      "order": 4,
      "title": "Recognise basic political institutions",
      "short": "Distinguish government, parliament, congress, president, prime minister and court.",
      "prereq": [
        "C02",
        "C03"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which institution primarily makes laws?",
        "opts": [
          "legislature",
          "executive department",
          "news organisation"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "A legislature makes or passes laws. A government or executive implements policy. Courts interpret and apply law.",
          "The exact institutions differ by country, but these functions help you identify their role."
        ],
        "model": "Parliament legislates; the government governs; courts interpret law.",
        "commonError": "Using Parliament and government as synonyms.",
        "practice": [
          {
            "q": "Which institution interprets law?",
            "opts": [
              "court",
              "cabinet",
              "newspaper"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say: “Parliament passes laws, the government implements policy, and courts interpret the law.”",
        "useIt": "Identify the institution in one current-affairs headline before discussing the issue.",
        "check": {
          "q": "Which distinction is correct?",
          "opts": [
            "Parliament and government always mean the same thing.",
            "A court interprets law; a legislature passes law.",
            "A newspaper implements policy."
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You identified both the institution and its core function. You can now use that information to contextualise a political document.",
          "partial": "The institution is recognised, but its function is still unclear.",
          "retry": "Separate three functions: making law, implementing policy and interpreting law."
        }
      }
    },
    {
      "id": "C05",
      "domain": "civilisation",
      "stage": 2,
      "order": 5,
      "title": "Explain the basic UK political structure",
      "short": "Connect the monarch, Prime Minister, government and Parliament.",
      "prereq": [
        "C04"
      ],
      "source": null,
      "diagnostic": {
        "q": "Who leads the UK government?",
        "opts": [
          "the monarch",
          "the Prime Minister",
          "the Speaker of the US House"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "The UK is a constitutional monarchy and parliamentary democracy. The monarch is head of state; the Prime Minister leads the government.",
          "Parliament consists of the House of Commons and the House of Lords. The government is normally drawn from Parliament."
        ],
        "model": "The elected House of Commons is central to forming and scrutinising the government.",
        "commonError": "Saying the monarch personally governs the country.",
        "practice": [
          {
            "q": "Which chamber is elected?",
            "opts": [
              "House of Commons",
              "House of Lords",
              "Supreme Court"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Give a three-sentence explanation of the UK system.",
        "useIt": "Use one institutional fact only when it directly helps explain a UK political article.",
        "check": {
          "q": "Which statement is accurate?",
          "opts": [
            "The monarch leads the government.",
            "The Prime Minister leads the government, while the monarch is head of state.",
            "The House of Lords elects the US president."
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You explained the UK structure by separating head of state, government and Parliament. That is enough context for many political documents.",
          "partial": "The main institutions are present, but their roles are still mixed together.",
          "retry": "Use one sentence per role: head of state, head of government, legislature."
        }
      }
    },
    {
      "id": "C06",
      "domain": "civilisation",
      "stage": 2,
      "order": 6,
      "title": "Explain the basic US political structure",
      "short": "Connect federalism, Congress, the presidency and the Supreme Court.",
      "prereq": [
        "C04"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which institution is the US federal legislature?",
        "opts": [
          "Congress",
          "Parliament of Canada",
          "the Cabinet Office"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "The United States is a federal presidential republic with separated powers.",
          "Congress legislates, the President heads the executive, and the Supreme Court is the highest federal court."
        ],
        "model": "The system combines federalism with checks and balances between branches.",
        "commonError": "Treating the President as able to make any law alone.",
        "practice": [
          {
            "q": "Who heads the federal executive?",
            "opts": [
              "the President",
              "the Chief Justice",
              "the Speaker alone"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Give a three-sentence explanation of Congress, the President and the Supreme Court.",
        "useIt": "When reading a US article, identify both the branch and the federal/state level involved.",
        "check": {
          "q": "Which statement is accurate?",
          "opts": [
            "Congress legislates and the President heads the executive.",
            "The Supreme Court is the legislature.",
            "States have no powers."
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You separated the federal branches and can now identify where a US political conflict is taking place.",
          "partial": "The main institution is recognised, but the branch or level of government is still unclear.",
          "retry": "Name the branch first—legislative, executive or judicial—then ask whether the issue is federal or state-level."
        }
      }
    },
    {
      "id": "C07",
      "domain": "civilisation",
      "stage": 2,
      "order": 7,
      "title": "Connect a country with a major tension",
      "short": "Move from facts to a recurring debate or contradiction.",
      "prereq": [
        "C01",
        "C04"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which is a genuine tension?",
        "opts": [
          "The UK has a capital city.",
          "Unity versus devolution in the UK.",
          "Canada is in North America."
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Civilisation becomes useful when facts illuminate tensions: unity and devolution, liberty and equality, diversity and cohesion, reconciliation and inequality.",
          "A tension is not a slogan; it is a conflict between priorities, ideals or lived realities."
        ],
        "model": "US: liberty and equality. UK: unity and devolution. South Africa: reconciliation and inequality.",
        "commonError": "Listing facts without explaining the connection to the issue.",
        "practice": [
          {
            "q": "Which pair fits South Africa?",
            "opts": [
              "reconciliation and inequality",
              "monarchy and Congress",
              "island and continent"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Choose one country and say: “A recurring tension is the gap between … and …”",
        "useIt": "Link one current article to a recurring country tension in one sentence.",
        "check": {
          "q": "Which sentence moves beyond a fact list?",
          "opts": [
            "The US has fifty states.",
            "The article reflects the tension between individual liberty and equal protection.",
            "The source is a newspaper."
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You used a country fact to reveal a larger tension. This is the move that turns civilisation knowledge into analysis.",
          "partial": "The relevant country is identified, but the fact has not yet been connected to a tension.",
          "retry": "Ask which two priorities, ideals or realities are in conflict in this document."
        }
      }
    },
    {
      "id": "C08",
      "domain": "civilisation",
      "stage": 2,
      "order": 8,
      "title": "Use relevant context without fact dumping",
      "short": "Select one or two facts and explain why they matter.",
      "prereq": [
        "C07"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which contextualisation is most useful?",
        "opts": [
          "Britain has a very long history.",
          "This closure comes amid the UK’s net-zero transition and concerns about industrial jobs.",
          "The UK has many cities."
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Good context explains why this document appeared now and what wider debate it belongs to.",
          "Select only facts that change the reader’s understanding, then stop."
        ],
        "model": "This article appears amid the UK’s net-zero transition, which has intensified debate over the cost to industrial communities.",
        "commonError": "Beginning with a long national history unrelated to the document’s immediate issue.",
        "practice": [
          {
            "q": "How much context is usually enough in an introduction?",
            "opts": [
              "Every fact you know",
              "One or two relevant facts with a clear connection",
              "No context at all"
            ],
            "answer": 1,
            "feedback": ""
          }
        ],
        "say": "Say one context sentence, then add: “This matters because…”",
        "useIt": "Use one relevant civilisation fact in your next introduction and explain its connection.",
        "check": {
          "q": "Which approach avoids fact dumping?",
          "opts": [
            "A full chronology before mentioning the document",
            "One precise fact linked directly to the issue",
            "A list of institutions with no explanation"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You selected context that does analytical work and stopped before it overwhelmed the document.",
          "partial": "The fact is accurate, but its relevance to this document is not yet explicit.",
          "retry": "After every context fact, complete the sentence: “This helps explain the document because…”"
        }
      }
    },
    {
      "id": "I01",
      "domain": "integrated",
      "stage": 1,
      "order": 1,
      "title": "Introduce a document in three sentences",
      "short": "Identify the document, state the topic and add immediate context.",
      "prereq": [
        "V02",
        "G04"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which element should be included in a short introduction?",
        "opts": [
          "document type and source",
          "every figure",
          "your final conclusion"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Sentence 1 identifies type, source and date. Sentence 2 states the topic. Sentence 3 gives only the immediate context needed.",
          "The introduction is a launchpad, not a complete summary or history lecture."
        ],
        "model": "This is a Reuters article published in May 2026. It deals with industrial job losses. It appeared after a major closure announcement.",
        "commonError": "Listing title, source and date without saying what the document is about.",
        "practice": [
          {
            "q": "What should the second sentence normally do?",
            "opts": [
              "state the topic",
              "give the entire plan",
              "translate the title word for word"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Deliver the three-sentence model aloud without rushing.",
        "useIt": "Use the three-sentence frame with your next class document.",
        "check": {
          "q": "Which sequence is clearest?",
          "opts": [
            "opinion → conclusion → source",
            "identification → topic → immediate context",
            "full history → title → apology"
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You produced a short introduction that identifies, focuses and contextualises the document without delaying the analysis.",
          "partial": "The document is identified, but the topic or immediate context is still missing.",
          "retry": "Use one sentence for identification, one for the topic and one for immediate context."
        }
      }
    },
    {
      "id": "I02",
      "domain": "integrated",
      "stage": 1,
      "order": 2,
      "title": "State the main issue clearly",
      "short": "Turn the topic into a precise issue sentence.",
      "prereq": [
        "I01",
        "V03"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which sentence states an issue rather than a broad topic?",
        "opts": [
          "The document is about industry.",
          "The issue is how decarbonisation can proceed without destroying industrial jobs.",
          "Industry exists in many countries."
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "A topic names the general area. An issue identifies the specific problem, tension or change raised by the document.",
          "Avoid empty phrases such as “This document talks about society”."
        ],
        "model": "The central issue is whether the green transition can protect industrial communities.",
        "commonError": "Repeating the title without identifying what is at stake.",
        "practice": [
          {
            "q": "What makes an issue sentence useful?",
            "opts": [
              "It identifies what is at stake.",
              "It lists every detail.",
              "It remains completely vague."
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say: “The central issue is…” and complete it with a tension.",
        "useIt": "State the main issue in one sentence before developing your next commentary.",
        "check": {
          "q": "Which formulation is most precise?",
          "opts": [
            "The text talks about politics.",
            "The issue is the conflict between border enforcement and civil liberties.",
            "There are many things to say."
          ],
          "answer": 1,
          "feedback": ""
        },
        "feedback": {
          "success": "You moved from a broad topic to a precise issue that can guide analysis.",
          "partial": "The general area is clear, but what is at stake remains too vague.",
          "retry": "Complete: “The central issue is whether/how…” and name the conflict or change."
        }
      }
    },
    {
      "id": "I03",
      "domain": "integrated",
      "stage": 1,
      "order": 3,
      "title": "Give one opinion, one reason and one example",
      "short": "Build a complete short response.",
      "prereq": [
        "V06",
        "I02"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which sequence is complete?",
        "opts": [
          "opinion only",
          "opinion + reason + example + explanation",
          "example list only"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Use a simple sequence: point → reason → example → explanation.",
          "The example should support the point, not replace it."
        ],
        "model": "I think the policy is unfair because its costs fall on poorer households. For example, energy bills represent a larger share of their income. This shows that the burden is unequal.",
        "commonError": "Stopping after the example without explaining its relevance.",
        "practice": [
          {
            "q": "What should follow an example?",
            "opts": [
              "an explanation of why it matters",
              "a completely new topic",
              "nothing"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Deliver a four-sentence mini-response using the sequence.",
        "useIt": "Use the same sequence once in class, even if each sentence is short.",
        "check": {
          "q": "Which final sentence explains relevance?",
          "opts": [
            "This example shows that the burden is unequal.",
            "For example.",
            "Another topic is education."
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You built a short argument rather than a collection of disconnected sentences. Each part now has a clear function.",
          "partial": "Your point and example are present, but the link between them needs to be stated.",
          "retry": "After the example, add: “This shows that…” and return explicitly to your point."
        }
      }
    },
    {
      "id": "I04",
      "domain": "integrated",
      "stage": 2,
      "order": 4,
      "title": "Add one relevant civilisation fact",
      "short": "Use background knowledge to clarify the issue.",
      "prereq": [
        "C08",
        "I02"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which use of civilisation knowledge is strongest?",
        "opts": [
          "A long list of presidents",
          "One relevant fact followed by its connection",
          "A random historical date"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "Choose a fact that explains the institution, recent event or long-term tension in the document.",
          "State the fact briefly, then explain its relevance."
        ],
        "model": "Because the US is a federal system, state and federal authorities may pursue different policies. This helps explain the legal conflict in the article.",
        "commonError": "Adding a true fact with no connection to the article.",
        "practice": [
          {
            "q": "What must follow the contextual fact?",
            "opts": [
              "an explanation of relevance",
              "another unrelated fact",
              "a translation"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Say the two-sentence pattern: fact, then connection.",
        "useIt": "Add exactly one context fact to your next spoken introduction or commentary.",
        "check": {
          "q": "Which sentence explains the connection?",
          "opts": [
            "This matters because the dispute concerns the division of powers.",
            "The US has many states.",
            "History is important."
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You used civilisation knowledge as evidence for understanding, not as a detached fact list.",
          "partial": "The fact is relevant, but the listener still has to infer why it matters.",
          "retry": "Add one explicit connection sentence beginning with “This helps explain…”"
        }
      }
    },
    {
      "id": "I05",
      "domain": "integrated",
      "stage": 2,
      "order": 5,
      "title": "Deliver a short guided mini-colle",
      "short": "Combine introduction, issue, point, example and context.",
      "prereq": [
        "I01",
        "I02",
        "I03",
        "I04"
      ],
      "source": null,
      "diagnostic": {
        "q": "Which plan is best for a short guided response?",
        "opts": [
          "many unrelated facts",
          "one clear issue and one developed point",
          "a translation of the document"
        ],
        "answer": 1,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "A short guided response can be structurally complete even before it becomes long.",
          "Use notes as prompts, not a script to read word for word."
        ],
        "model": "Introduction → issue → one developed point → relevant context → brief conclusion.",
        "commonError": "Trying to cover three weak ideas instead of developing one clear idea.",
        "practice": [
          {
            "q": "How should notes be used?",
            "opts": [
              "as prompts",
              "as a complete script read aloud",
              "not at all"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Speak for about one minute using five keywords only.",
        "useIt": "Test this mini-colle in class or with a classmate and note one correction to reuse.",
        "check": {
          "q": "Which response is strongest?",
          "opts": [
            "one clear point supported and explained",
            "three undeveloped opinions",
            "a long factual list"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You combined the core parts of a colle into one coherent short response. The structure is now strong enough to expand gradually.",
          "partial": "Most parts are present, but one section is still disconnected or read rather than delivered.",
          "retry": "Reduce your notes to five prompts and make the link between each section explicit."
        }
      }
    },
    {
      "id": "M00",
      "domain": "methodology",
      "stage": 1,
      "order": 1,
      "title": "Understand the colle",
      "short": "What the exam really tests",
      "prereq": [],
      "source": "methodology.html#m0",
      "diagnostic": {
        "q": "The main goal of a colle is to…",
        "opts": [
          "Summarise the document accurately",
          "Analyse it and defend an argued, problematised response",
          "Show how much you know",
          "List pros and cons"
        ],
        "answer": 1,
        "feedback": "A colle tests critical analysis and argument built on the document."
      },
      "mission": {
        "learn": [
          "What a colle evaluates: A colle tests, together: your understanding of the document, your ability to prioritise information, to reformulate, to contextualise, to build a line of reasoning, the quality of your argument, your command of English, the clarity of your delivery, your interaction with the examiner, your time management, and your ability to take previous corrections into account.",
          "The ten-step arc of a colle: 1) Discover the document. 2) Identify the essentials. 3) Understand the underlying issue. 4) Put it into context. 5) Formulate the key question. 6) Build an outline that answers it. 7) Select relevant examples. 8) Deliver a clear presentation. 9) Conclude. 10) Discuss and defend your ideas.",
          "Four things a commentary is NOT: Not a paraphrase of the document. Not an endless summary. Not a recital of civilisation knowledge with no precise link to the document. Not an improvised opinion with no structure. A successful commentary analyses — it explains how and why, and what is at stake."
        ],
        "model": "The same document, four ways: On the Port Talbot report — Understand: a steelworks is closing, jobs are at risk. Summarise: Tata will shut its blast furnaces, ~2,800 jobs at risk, shifting to a subsidised green furnace. Comment: the document stages a collision between decarbonisation and the survival of an industrial community. Recite (the trap): 'Wales has a long industrial history since the coal era…' — true, but it answers nothing.",
        "commonError": "Avoid: “This document speaks about a factory. First the advantages, then the disadvantages.” Better: “This factual report raises a sharper question: can a nation decarbonise its industry without sacrificing the communities built around it?”",
        "practice": [
          {
            "q": "“Analysing” a document means…",
            "opts": [
              "Retelling it in your own words",
              "Explaining how and why it works, and what is at stake",
              "Translating the hard sentences",
              "Listing every fact"
            ],
            "answer": 1,
            "feedback": "Analysis is about the how, the why and the stakes — not paraphrase."
          },
          {
            "q": "Which is NOT part of what a colle evaluates?",
            "opts": [
              "Time management",
              "Interaction with the examiner",
              "Your handwriting speed",
              "Contextualisation"
            ],
            "answer": 2,
            "feedback": "Handwriting speed is irrelevant; the rest are all assessed."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Understand the colle”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "Which is NOT part of what a colle evaluates?",
          "opts": [
            "Time management",
            "Interaction with the examiner",
            "Your handwriting speed",
            "Contextualisation"
          ],
          "answer": 2,
          "feedback": "Handwriting speed is irrelevant; the rest are all assessed."
        },
        "feedback": {
          "success": "You applied the core method for understand the colle and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M01",
      "domain": "methodology",
      "stage": 1,
      "order": 2,
      "title": "Managing preparation time",
      "short": "Time strategy",
      "prereq": [
        "M01"
      ],
      "source": "methodology.html#m1",
      "diagnostic": {
        "q": "With 20 minutes to prepare, roughly how long on discovering + understanding?",
        "opts": [
          "1–2 minutes",
          "About 6–8 minutes",
          "The full 20",
          "Skip it"
        ],
        "answer": 1,
        "feedback": "Understanding deserves a solid share — but not all of it. Around a third is workable."
      },
      "mission": {
        "learn": [
          "No universal rule: Preparation time and format vary by school and track. Your teacher's instructions always take priority. What follows is an adaptable framework, not a fixed law.",
          "A workable division: Roughly: discovering + understanding the document (about a third), selecting information and contextualising (a quarter), key question + outline (a quarter), examples + introduction/conclusion + re-reading notes (the rest). Adjust to your total time.",
          "The golden warning: Do not spend half of your preparation translating the first paragraph. Read for meaning, in chunks, and keep moving."
        ],
        "model": "Same clock, three documents: For a written article you can re-read — budget more time for selection. For audio you cannot re-read — budget listening passes and note-taking. For video — add time to read the images. The proportions shift with the format.",
        "commonError": "Avoid: Spending 8 of 20 minutes translating paragraph one word by word. Better: Skimming the whole document first, then returning only to the passages that matter.",
        "practice": [
          {
            "q": "You're stuck on one unknown word after a minute. You should…",
            "opts": [
              "Keep decoding it until it's clear",
              "Infer from context and move on",
              "Abandon the document",
              "Translate the whole sentence"
            ],
            "answer": 1,
            "feedback": "One unknown word rarely blocks meaning. Infer and move on."
          },
          {
            "q": "The best sign it's time to move to the next step is…",
            "opts": [
              "You've used exactly the planned minutes",
              "You can state in one sentence what the step gave you",
              "You've filled a page of notes",
              "You feel nervous"
            ],
            "answer": 1,
            "feedback": "Being able to sum up the step in a sentence shows it's done."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Managing preparation time”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "The best sign it's time to move to the next step is…",
          "opts": [
            "You've used exactly the planned minutes",
            "You can state in one sentence what the step gave you",
            "You've filled a page of notes",
            "You feel nervous"
          ],
          "answer": 1,
          "feedback": "Being able to sum up the step in a sentence shows it's done."
        },
        "feedback": {
          "success": "You applied the core method for managing preparation time and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M02",
      "domain": "methodology",
      "stage": 1,
      "order": 3,
      "title": "Reading faster and better",
      "short": "Efficient reading",
      "prereq": [
        "M02"
      ],
      "source": "methodology.html#m2",
      "diagnostic": {
        "q": "On a first pass you should read, in priority…",
        "opts": [
          "Every paragraph in full",
          "Title, source, date, first and last paragraphs",
          "Only the figures",
          "The middle only"
        ],
        "answer": 1,
        "feedback": "The frame (title/source/first/last) gives the situation fastest."
      },
      "mission": {
        "learn": [
          "First pass — identify the situation: Look first at: title, subtitle, source, date, author, document type, country, main people or institutions, first paragraph, last paragraph. Goal: grasp the general topic and situation.",
          "Second pass — map the structure: Spot the stages, topic shifts, causes, consequences, oppositions, concessions, examples, quotations, figures, logical connectors, and repeated vocabulary. You are drawing the skeleton.",
          "Third pass — select evidence: Return only to the passages you need: to verify a fact, note a precise example, grasp a nuance, prepare the commentary. Not every paragraph deserves equal attention."
        ],
        "model": "First pass on Port Talbot: Title + source + date tell you: a UK steelworks, a corporate announcement, recent. First and last paragraphs frame it: closure + transition, union anger. In 60 seconds you already have the situation — no translation needed.",
        "commonError": "Avoid: Translating 'blast furnace' and 'decarbonise' before reading on. Better: Reading the paragraph in chunks, guessing both from context, checking later only if needed.",
        "practice": [
          {
            "q": "A 'false friend' is a word that…",
            "opts": [
              "Has no translation",
              "Looks like a French word but means something different",
              "Is always capitalised",
              "Is a proper noun"
            ],
            "answer": 1,
            "feedback": "E.g. 'actually' ≠ 'actuellement'. Transparent-looking words can mislead."
          },
          {
            "q": "Reading 'in sense-groups' means…",
            "opts": [
              "One word at a time",
              "Grouping words into meaningful chunks",
              "Reading aloud",
              "Reading only nouns"
            ],
            "answer": 1,
            "feedback": "Chunking speeds reading and preserves meaning."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Reading faster and better”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "Reading 'in sense-groups' means…",
          "opts": [
            "One word at a time",
            "Grouping words into meaningful chunks",
            "Reading aloud",
            "Reading only nouns"
          ],
          "answer": 1,
          "feedback": "Chunking speeds reading and preserves meaning."
        },
        "feedback": {
          "success": "You applied the core method for reading faster and better and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M03",
      "domain": "methodology",
      "stage": 1,
      "order": 4,
      "title": "Understanding audio & video",
      "short": "Listening / viewing method",
      "prereq": [
        "M03"
      ],
      "source": "methodology.html#m3",
      "diagnostic": {
        "q": "On a first listening, your priority is…",
        "opts": [
          "Every exact figure",
          "The big picture: who, what, where, tone, structure",
          "Spelling every name",
          "A word-for-word transcript"
        ],
        "answer": 1,
        "feedback": "Big picture first; details on later passes."
      },
      "mission": {
        "learn": [
          "Before listening or watching: Use what you already have: title, source, date, image, programme name, speaker, duration, likely theme. Form a few hypotheses — but hold them loosely.",
          "First listening — the big picture: Who is speaking? What is the main topic? Where and when? What is the general tone? What is the main event, claim or concern? How is it organised?",
          "Second listening — the structure: Track the different voices, topic shifts, agreements and disagreements, causes and consequences, examples, key figures, proper nouns, transitions, reformulations, interim conclusions."
        ],
        "model": "Before pressing play (ICE podcast): Source: BBC World Service. Guest: a CBS reporter. Title: 'The origins of ICE'. Hypothesis: history + controversy of a US immigration agency. You already expect a security-vs-liberty tension — confirm or revise it as you listen.",
        "commonError": "Avoid: Trying to write down every word the speaker says. Better: Capturing structure with arrows, columns and symbols, leaving gaps to fill on a second pass.",
        "practice": [
          {
            "q": "Images in a video…",
            "opts": [
              "Are always neutral",
              "Can support but also bias interpretation",
              "Should be ignored",
              "Replace the audio"
            ],
            "answer": 1,
            "feedback": "Visuals inform — and can steer — interpretation."
          },
          {
            "q": "Good audio notes rely on…",
            "opts": [
              "Full sentences",
              "Abbreviations, arrows and spatial layout",
              "One long paragraph",
              "Colour only"
            ],
            "answer": 1,
            "feedback": "Symbols and layout capture structure fast."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Understanding audio & video”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "Good audio notes rely on…",
          "opts": [
            "Full sentences",
            "Abbreviations, arrows and spatial layout",
            "One long paragraph",
            "Colour only"
          ],
          "answer": 1,
          "feedback": "Symbols and layout capture structure fast."
        },
        "feedback": {
          "success": "You applied the core method for understanding audio & video and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M04",
      "domain": "methodology",
      "stage": 1,
      "order": 5,
      "title": "Identifying essential information",
      "short": "Prioritising",
      "prereq": [
        "M04"
      ],
      "source": "methodology.html#m4",
      "diagnostic": {
        "q": "A statistic becomes essential when it…",
        "opts": [
          "Is a big number",
          "Shows change, scale, inequality or contradiction",
          "Appears first",
          "Is a percentage"
        ],
        "answer": 1,
        "feedback": "Function, not size, makes a figure essential."
      },
      "mission": {
        "learn": [
          "The mapping questions: Who? What? Where? When? Why? How? What changed? Who is affected? What is at stake? What tension does the document reveal?",
          "Four tiers of information: Essential (without it, the document can't be understood). Supporting (explains or proves the main idea). Illustration/anecdote (makes it concrete, not always needed in a summary). Contextual (links it to a wider situation).",
          "A figure is not automatically essential: A number matters when it shows an evolution, measures a scale, reveals an inequality, contradicts a claim, or enables a comparison. Otherwise it is decoration."
        ],
        "model": "Mapping Port Talbot: Who: Tata Steel, 2,800 workers, the union, government. What: blast-furnace closure + green furnace. Why: decarbonisation + cost. What's at stake: the survival of an industrial community vs the climate imperative. That last line is the tension.",
        "commonError": "Avoid: Noting every figure in the document because 'numbers look important'. Better: Keeping only the figures that show scale, change or inequality.",
        "practice": [
          {
            "q": "An anecdote in a document is…",
            "opts": [
              "Always essential",
              "Often an illustration, not always needed in a summary",
              "Never useful",
              "The main idea"
            ],
            "answer": 1,
            "feedback": "Anecdotes illustrate; they rarely belong in a tight summary."
          },
          {
            "q": "'What is at stake?' helps you find…",
            "opts": [
              "The word count",
              "The underlying issue / tension",
              "The author's age",
              "The font"
            ],
            "answer": 1,
            "feedback": "It points straight at the tension."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Identifying essential information”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "'What is at stake?' helps you find…",
          "opts": [
            "The word count",
            "The underlying issue / tension",
            "The author's age",
            "The font"
          ],
          "answer": 1,
          "feedback": "It points straight at the tension."
        },
        "feedback": {
          "success": "You applied the core method for identifying essential information and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M05",
      "domain": "methodology",
      "stage": 2,
      "order": 6,
      "title": "Writing an effective summary",
      "short": "Summarising",
      "prereq": [
        "M05"
      ],
      "source": "methodology.html#m5",
      "diagnostic": {
        "q": "A good summary is…",
        "opts": [
          "Paragraph-by-paragraph",
          "Faithful, neutral, concise and reformulated",
          "Full of quotations",
          "Your opinion of the text"
        ],
        "answer": 1,
        "feedback": "Faithful, neutral, concise, reworded."
      },
      "mission": {
        "learn": [
          "What a good summary is: Faithful, neutral, concise, structured, reformulated, prioritised, and clear to someone who hasn't seen the document.",
          "What it is NOT: Not a paragraph-by-paragraph crawl, not the document's own wording, not a pile of every figure, not a personal opinion, not the start of your commentary, not a list of details standing in for understanding.",
          "Three steps: reduce, regroup, reformulate: Reduce: cut secondary details, repetitions, non-essential illustrations. Regroup: gather information that serves the same function. Reformulate: restate in clear, precise words of your own."
        ],
        "model": "A model summary of Port Talbot: 'A major steelmaker has announced it will close its blast furnaces, putting thousands of jobs at risk, and switch to a lower-carbon furnace supported by public funds; unions have condemned the decision as needlessly destructive.' Faithful, neutral, reformulated, one sentence.",
        "commonError": "Avoid: 'The first paragraph says… then the second paragraph says… then the third…' Better: One reworded, prioritised sentence capturing closure + jobs + green shift + reaction.",
        "practice": [
          {
            "q": "Which sentence belongs in a summary?",
            "opts": [
              "'This outrageous decision proves capitalism has failed.'",
              "'The company will close its furnaces, cutting thousands of jobs.'",
              "'I think the workers are right.'",
              "'Firstly, the second paragraph explains…'"
            ],
            "answer": 1,
            "feedback": "Neutral, faithful, reworded — no opinion, no paragraph crawl."
          },
          {
            "q": "The three summary steps are…",
            "opts": [
              "Read, translate, copy",
              "Reduce, regroup, reformulate",
              "Quote, list, conclude",
              "Skim, skip, stop"
            ],
            "answer": 1,
            "feedback": "Reduce → regroup → reformulate."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Writing an effective summary”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "The three summary steps are…",
          "opts": [
            "Read, translate, copy",
            "Reduce, regroup, reformulate",
            "Quote, list, conclude",
            "Skim, skip, stop"
          ],
          "answer": 1,
          "feedback": "Reduce → regroup → reformulate."
        },
        "feedback": {
          "success": "You applied the core method for writing an effective summary and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M06",
      "domain": "methodology",
      "stage": 2,
      "order": 7,
      "title": "Contextualising the document",
      "short": "Context",
      "prereq": [
        "M06"
      ],
      "source": "methodology.html#m6",
      "diagnostic": {
        "q": "Good contextualisation…",
        "opts": [
          "Lists the country's entire history",
          "Explains why THIS document matters now",
          "Gives only title and date",
          "Avoids the syllabus"
        ],
        "answer": 1,
        "feedback": "Relevant context explains the document's immediate significance."
      },
      "mission": {
        "learn": [
          "What contextualising really means: Explaining what is needed to understand: why this document appeared now, what event or debate triggered it, the political/economic/social/cultural backdrop, the institutions and populations involved, how it connects to the civilisation syllabus, and why it matters.",
          "Four things to avoid: Decorative knowledge (true but useless here). Historical dumping (a long chronology that delays analysis). Unsupported claims (vague, exaggerated, unverifiable). And the bare minimum (title/date/source only).",
          "A five-step method: 1) Identify the immediate event. 2) Identify the broader debate. 3) Select one or two pieces of civilisation knowledge. 4) Explain the connection. 5) Stop before context overwhelms the document."
        ],
        "model": "Contextualising Port Talbot well: Immediate event: Tata's closure announcement. Broader debate: the UK's industrial decarbonisation and 'just transition'. Civilisation knowledge: post-industrial decline in Wales; Britain's net-zero commitments. Connection: this single plant crystallises a national dilemma. Then stop — don't recite the whole history of British coal.",
        "commonError": "Avoid: 'Since the Industrial Revolution, Britain has had many factories and much history…' Better: 'This closure lands amid Britain's push for net zero, turning one plant into a test of whether decarbonisation can spare industrial communities.'",
        "practice": [
          {
            "q": "'Historical dumping' means…",
            "opts": [
              "A precise, useful fact",
              "A long chronology that delays analysis",
              "A single date",
              "A quotation"
            ],
            "answer": 1,
            "feedback": "Too much history, too little analysis."
          },
          {
            "q": "After the immediate event, the next step is to identify…",
            "opts": [
              "The broader debate",
              "The word count",
              "The author's salary",
              "The font size"
            ],
            "answer": 0,
            "feedback": "Move from the event to the wider debate."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Contextualising the document”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "After the immediate event, the next step is to identify…",
          "opts": [
            "The broader debate",
            "The word count",
            "The author's salary",
            "The font size"
          ],
          "answer": 0,
          "feedback": "Move from the event to the wider debate."
        },
        "feedback": {
          "success": "You applied the core method for contextualising the document and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M07",
      "domain": "methodology",
      "stage": 2,
      "order": 8,
      "title": "Finding the key question",
      "short": "Problematising",
      "prereq": [
        "M07"
      ],
      "source": "methodology.html#m7",
      "diagnostic": {
        "q": "Which is a genuine key question?",
        "opts": [
          "'What is ICE?'",
          "'How far can enforcement grow before it erodes liberty?'",
          "'Is immigration good or bad?'",
          "'To what extent is ICE special?'"
        ],
        "answer": 1,
        "feedback": "It names a tension and can be argued — unlike a factual or yes/no question."
      },
      "mission": {
        "learn": [
          "A key question = a tension: A strong problematic reveals a tension, a contradiction, a transformation, a paradox, a gap between an ideal and a reality, a conflict of priorities, or a wider stake exposed by the document.",
          "It must be / it must not be: Must be: clear, precise, genuinely interrogative, tied to the document, broad enough to think with, focused enough to answer, a single main question. Must NOT be: a restated title, a factual or yes/no question, an endless or double question, a generic all-purpose formula, empty abstraction, or disconnected from the document.",
          "Four steps: 1) Identify the topic. 2) Identify the tension (what resists a simple explanation). 3) Identify the broader stakes (why the tension matters). 4) Turn it into one key question that analyses both the document and its stakes."
        ],
        "model": "Article — Port Talbot: Tension: progress vs its human cost. → 'Can a nation decarbonise heavy industry without sacrificing the communities built around it?'",
        "commonError": "Avoid: 'To what extent is ICE controversial?' Better: 'How far can a state expand enforcement before it erodes the liberties it claims to defend?'",
        "practice": [
          {
            "q": "A key question must NOT be…",
            "opts": [
              "Tied to the document",
              "A single main question",
              "A restated title",
              "Genuinely interrogative"
            ],
            "answer": 2,
            "feedback": "Restating the title is not problematising."
          },
          {
            "q": "The forbidden opener on this site is…",
            "opts": [
              "'How does… reveal…?'",
              "'To what extent…?'",
              "'Why has… become…?'",
              "'What does the gap between… reveal?'"
            ],
            "answer": 1,
            "feedback": "'To what extent' is banned; use a sharper opener."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Finding the key question”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "The forbidden opener on this site is…",
          "opts": [
            "'How does… reveal…?'",
            "'To what extent…?'",
            "'Why has… become…?'",
            "'What does the gap between… reveal?'"
          ],
          "answer": 1,
          "feedback": "'To what extent' is banned; use a sharper opener."
        },
        "feedback": {
          "success": "You applied the core method for finding the key question and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M08",
      "domain": "methodology",
      "stage": 2,
      "order": 9,
      "title": "Building a relevant outline",
      "short": "Outlining",
      "prereq": [
        "M08"
      ],
      "source": "methodology.html#m8",
      "diagnostic": {
        "q": "A relevant outline…",
        "opts": [
          "Splits the topic into pros and cons",
          "Progressively answers the key question",
          "Copies the document's order",
          "Lists everything you know"
        ],
        "answer": 1,
        "feedback": "It answers the question step by step."
      },
      "mission": {
        "learn": [
          "The banned plan: No advantages/disadvantages, pros/cons, for/against, yes/no, positive/negative. Splitting the topic into two camps is not a line of reasoning.",
          "What each part must do: Defend an idea, advance one step of the answer, stay distinct from the others, carry examples, move the reasoning forward, and stay tied to the document and context.",
          "Document structure ≠ presentation outline: The order the journalist chose is not necessarily the order you choose to answer your own key question. Reorganise around your argument, not theirs."
        ],
        "model": "An outline that moves (Port Talbot): Key question: can decarbonisation spare industrial communities? I — the green imperative is genuine (necessity, climate goals, the new furnace). II — but its human cost is borne unequally (2,800 jobs, a community, 'managed decline'). III — so the real issue is HOW transition is governed (retraining, phasing, the £500m). Thesis → complication → reframing.",
        "commonError": "Avoid: I — Advantages of the closure. II — Disadvantages. Better: I — the green case is real. II — its cost is unequal. III — the true issue is how transition is governed.",
        "practice": [
          {
            "q": "If the headings could be swapped without changing anything, the plan…",
            "opts": [
              "Is perfectly balanced",
              "Probably lacks progression",
              "Is too detailed",
              "Is ideal"
            ],
            "answer": 1,
            "feedback": "Interchangeable parts = no real movement."
          },
          {
            "q": "The document's structure and your outline…",
            "opts": [
              "Must always match",
              "Can differ — you organise around your question",
              "Are irrelevant",
              "Must be reversed"
            ],
            "answer": 1,
            "feedback": "Reorganise around your argument, not the author's."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Building a relevant outline”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "The document's structure and your outline…",
          "opts": [
            "Must always match",
            "Can differ — you organise around your question",
            "Are irrelevant",
            "Must be reversed"
          ],
          "answer": 1,
          "feedback": "Reorganise around your argument, not the author's."
        },
        "feedback": {
          "success": "You applied the core method for building a relevant outline and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M09",
      "domain": "methodology",
      "stage": 3,
      "order": 10,
      "title": "Finding & using examples",
      "short": "Evidence",
      "prereq": [
        "M09"
      ],
      "source": "methodology.html#m9",
      "diagnostic": {
        "q": "An example must above all be…",
        "opts": [
          "Impressive-sounding",
          "Precise, exact and tied to the argument",
          "Recent",
          "Foreign"
        ],
        "answer": 1,
        "feedback": "Relevance and precision beat name-dropping."
      },
      "mission": {
        "learn": [
          "Where examples come from: The document itself, the English course, civilisation classes, recent news, a comparable situation, a relevant historical event, an institution, a policy decision, a verified statistic, a speech or public policy.",
          "What an example must be: Precise, exact, understandable, directly tied to the argument, explained, and used to prove or qualify something. An isolated proper noun is not an example. A recited date is not an argument. An invented statistic must never be used.",
          "The four-move structure: Make the point. Give precise evidence. Explain what it demonstrates. Link it back to the key question."
        ],
        "model": "A worked example: Point: transition costs fall unevenly. Evidence: Port Talbot's 2,800 jobs concentrated in one town. Explanation: a national policy becomes a local shock. Link: which is why the key question is not green vs jobs, but how transition is governed.",
        "commonError": "Avoid: 'Thatcher. Deindustrialisation. Wales.' (name-dropping) Better: 'The 1980s pit closures show how quickly a mono-industry town can collapse when its core employer goes — the risk Port Talbot now faces.'",
        "practice": [
          {
            "q": "An isolated proper noun is…",
            "opts": [
              "A strong example",
              "Not an example — it needs explanation and a link",
              "The best evidence",
              "A conclusion"
            ],
            "answer": 1,
            "feedback": "Explain it and connect it, or it proves nothing."
          },
          {
            "q": "If you can't find an example, you should…",
            "opts": [
              "Invent a plausible statistic",
              "Return to the document's facts or a known case",
              "Skip the argument",
              "Guess a number"
            ],
            "answer": 1,
            "feedback": "Never invent — fall back on the document or a known case."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Finding & using examples”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "If you can't find an example, you should…",
          "opts": [
            "Invent a plausible statistic",
            "Return to the document's facts or a known case",
            "Skip the argument",
            "Guess a number"
          ],
          "answer": 1,
          "feedback": "Never invent — fall back on the document or a known case."
        },
        "feedback": {
          "success": "You applied the core method for finding & using examples and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M10",
      "domain": "methodology",
      "stage": 3,
      "order": 11,
      "title": "Building the introduction",
      "short": "Introductions",
      "prereq": [
        "M10"
      ],
      "source": "methodology.html#m10",
      "diagnostic": {
        "q": "Which action best matches “Building the introduction”?",
        "opts": [
          "Introductions",
          "Ignore the document",
          "Translate every word"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "What it may contain: A directly relevant hook, a precise presentation of the document, contextualisation, the identification of the central issue, the key question, and the announcement of the plan — following your teacher's expectations.",
          "The hook: what to avoid: No memorised quotation with no precise link, no dictionary definition, no 'Since the dawn of time', no sweeping generality about society/mankind/the world, no spectacular claim you can't justify.",
          "Useful, flexible openers: 'This document was published in the immediate aftermath of…' · 'It comes at a time when…' · 'The report focuses on…, but it also raises the broader issue of…' · 'This local event reflects a wider debate over…' · 'Beyond the immediate controversy, the document reveals…' · 'The key question is therefore…' — never 'To what extent'."
        ],
        "model": "An annotated model introduction: [Hook] 'In Port Talbot, saving the planet and saving a town have been set against each other.' [Document] 'This factual report announces Tata's blast-furnace closure and its shift to a subsidised green furnace.' [Context] 'It lands amid Britain's net-zero push.' [Tension] 'It stages a collision between climate action and industrial communities.' [Key question] 'Can decarbonisation spare the communities it disrupts?' [Plan] 'I will first…, then…, before…'",
        "commonError": "Avoid: 'Since the dawn of time, work has mattered to mankind.' Better: 'In Port Talbot, saving the planet and saving a town have been set against each other.'",
        "practice": [
          {
            "q": "Which action best matches “Building the introduction”?",
            "opts": [
              "Introductions",
              "Ignore the document",
              "Translate every word"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Building the introduction”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "Which action best matches “Building the introduction”?",
          "opts": [
            "Introductions",
            "Ignore the document",
            "Translate every word"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You applied the core method for building the introduction and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M11",
      "domain": "methodology",
      "stage": 3,
      "order": 12,
      "title": "Developing the commentary",
      "short": "Argumentation",
      "prereq": [
        "M11"
      ],
      "source": "methodology.html#m11",
      "diagnostic": {
        "q": "After the introduction, the document should…",
        "opts": [
          "Disappear — now it's all context",
          "Stay present throughout the commentary",
          "Appear only in the conclusion",
          "Be quoted in full"
        ],
        "answer": 1,
        "feedback": "Keep returning to the document."
      },
      "mission": {
        "learn": [
          "A flexible part structure: State the main idea; explain it; connect it to the document; add relevant evidence or context; analyse the significance; link back to the key question; transition to the next idea.",
          "The balance to hold: Reference to the document, outside knowledge, analysis, examples, nuance — in proportion. The document must not disappear; the course must not crush it; personal opinion must not replace analysis.",
          "Formulations serve thought, not recital: Use function-based phrases (introduce an argument, explain, give evidence, refer to the document, put into perspective, contrast, concede, qualify, draw a consequence, return to the key question, move on) — to structure thinking, never to pad."
        ],
        "model": "One developed part: Idea: the transition's cost is unequal. Explain: national policy, local shock. Document: the report's 2,800 jobs in one town. Analysis: a community, not just a workforce, is exposed. Link: which is why 'how' matters more than 'whether'. Transition: 'This raises the deeper question of governance…'",
        "commonError": "Avoid: A part that lists five facts from the document with no analysis. Better: A part built on one idea, evidenced, analysed, and linked back to the question.",
        "practice": [
          {
            "q": "A commentary part should be built on…",
            "opts": [
              "A list of facts",
              "One governing idea, evidenced and analysed",
              "Your personal opinion",
              "A quotation chain"
            ],
            "answer": 1,
            "feedback": "One idea, argued — not a list."
          },
          {
            "q": "Ready-made phrases should…",
            "opts": [
              "Replace your thinking",
              "Serve and structure your thinking",
              "Fill time",
              "Be recited in order"
            ],
            "answer": 1,
            "feedback": "They serve thought, never replace it."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Developing the commentary”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "Ready-made phrases should…",
          "opts": [
            "Replace your thinking",
            "Serve and structure your thinking",
            "Fill time",
            "Be recited in order"
          ],
          "answer": 1,
          "feedback": "They serve thought, never replace it."
        },
        "feedback": {
          "success": "You applied the core method for developing the commentary and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M12",
      "domain": "methodology",
      "stage": 3,
      "order": 13,
      "title": "Concluding & finding an opening",
      "short": "Conclusions",
      "prereq": [
        "M12"
      ],
      "source": "methodology.html#m12",
      "diagnostic": {
        "q": "A conclusion must first…",
        "opts": [
          "Repeat the plan word for word",
          "Answer the key question explicitly",
          "Introduce a brand-new topic",
          "Summarise every paragraph"
        ],
        "answer": 1,
        "feedback": "Answer the question you raised."
      },
      "mission": {
        "learn": [
          "What a conclusion must do: Answer the key question clearly, synthesise the reasoning (without repeating the plan word for word), show what the analysis revealed, and offer a relevant opening.",
          "Conclusions to avoid: 'This issue is very complicated.' 'There are advantages and disadvantages.' 'Only time will tell.' 'Everyone has a different opinion.' 'We'll have to wait and see.' 'This will remain important in the future.' All empty.",
          "A good opening: Extends the analysis precisely, stays tied to the stake, feels logical (not a giant new topic), and introduces a comparison, an evolution, or a neighbouring question. Types: comparison with another country, recent evolution, longer-term consequence, institutional question, generational shift, unresolved contradiction, another case revealing the same tension."
        ],
        "model": "A model conclusion + opening: Answer: decarbonisation and community survival are not opposites — but only if transition is governed justly. Opening: 'Port Talbot may be less a Welsh story than a rehearsal for every industrial democracy facing the same reckoning.'",
        "commonError": "Avoid: 'In conclusion, there are pros and cons and only time will tell.' Better: 'Decarbonisation need not doom communities — provided transition is governed justly; Port Talbot rehearses a reckoning every industrial democracy will face.'",
        "practice": [
          {
            "q": "Which is an empty conclusion?",
            "opts": [
              "'Decarbonisation need not doom communities if transition is just.'",
              "'Only time will tell.'",
              "'The gap reveals a governance failure.'",
              "'This rehearses a wider reckoning.'"
            ],
            "answer": 1,
            "feedback": "'Only time will tell' says nothing."
          },
          {
            "q": "A good opening…",
            "opts": [
              "Launches a huge new subject",
              "Extends the analysis to a neighbouring question",
              "Repeats the introduction",
              "Lists sources"
            ],
            "answer": 1,
            "feedback": "It extends, it doesn't restart."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Concluding & finding an opening”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "A good opening…",
          "opts": [
            "Launches a huge new subject",
            "Extends the analysis to a neighbouring question",
            "Repeats the introduction",
            "Lists sources"
          ],
          "answer": 1,
          "feedback": "It extends, it doesn't restart."
        },
        "feedback": {
          "success": "You applied the core method for concluding & finding an opening and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M13",
      "domain": "methodology",
      "stage": 4,
      "order": 14,
      "title": "Speaking clearly & using notes",
      "short": "Oral delivery",
      "prereq": [
        "M13"
      ],
      "source": "methodology.html#m13",
      "diagnostic": {
        "q": "Good notes for speaking are…",
        "opts": [
          "Full written sentences",
          "Keywords, arrows and abbreviations",
          "A verbatim script",
          "Blank"
        ],
        "answer": 1,
        "feedback": "Keywords let you speak, not read."
      },
      "mission": {
        "learn": [
          "What to work on: Pace, pauses, articulation, intonation, stress, volume, sense-groups, transitions, eye contact, posture, note handling, correcting an error, recovering after a blank.",
          "Notes are a map, not a script: Turn full sentences into keywords, arrows, abbreviations, examples, transitions, key dates, pronunciation reminders. You should be able to speak from a glance, not read.",
          "Phrases to handle a difficulty: 'Let me rephrase that.' · 'What I mean is…' · 'I should qualify that point.' · 'A more accurate way of putting it would be…' · 'Let me start again.' · 'The main point is…' · 'I can't recall the exact figure, but the broader trend is…' — and never invent a forgotten figure."
        ],
        "model": "Train it in the Colle Trainer: The Colle Trainer draws a real document of the day, walks you through analysis, question and plan, then times your spoken performance — with a full transition bank. That is where delivery is built.",
        "commonError": "Avoid: Reading every word, eyes down, flat tone, no transitions. Better: Glancing at keyword notes, eyes up, signposting each move, slowing on the key question.",
        "practice": [
          {
            "q": "If you forget a figure, you should…",
            "opts": [
              "Invent a plausible one",
              "Give the broader trend honestly",
              "Stop talking",
              "Guess confidently"
            ],
            "answer": 1,
            "feedback": "Never invent — give the trend."
          },
          {
            "q": "To recover after a blank, a good phrase is…",
            "opts": [
              "'Let me rephrase that / the main point is…'",
              "Silence until it returns",
              "'I don't know'",
              "Change the subject entirely"
            ],
            "answer": 0,
            "feedback": "A recovery phrase keeps you in control."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Speaking clearly & using notes”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "To recover after a blank, a good phrase is…",
          "opts": [
            "'Let me rephrase that / the main point is…'",
            "Silence until it returns",
            "'I don't know'",
            "Change the subject entirely"
          ],
          "answer": 0,
          "feedback": "A recovery phrase keeps you in control."
        },
        "feedback": {
          "success": "You applied the core method for speaking clearly & using notes and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M14",
      "domain": "methodology",
      "stage": 4,
      "order": 15,
      "title": "Handling the discussion",
      "short": "Interaction",
      "prereq": [
        "M14"
      ],
      "source": "methodology.html#m14",
      "diagnostic": {
        "q": "When you disagree with the examiner, you should…",
        "opts": [
          "Become firm and defensive",
          "Disagree respectfully and give a reason",
          "Immediately concede everything",
          "Repeat your point louder"
        ],
        "answer": 1,
        "feedback": "Respectful, reasoned disagreement is valued."
      },
      "mission": {
        "learn": [
          "How to handle a question: Listen to the end; identify what is really asked; answer directly; justify; give an example; qualify; return to the document; acknowledge a limit; ask for clarification if needed; correct an over-strong claim; disagree respectfully.",
          "Useful formulations: 'If I understand your question correctly…' · 'I would argue that…' · 'The document suggests that…, although…' · 'One example that supports this is…' · 'I would distinguish between…' · 'I agree up to a point, but…' · 'I'm not certain of the exact figure, so I'll focus on…' · 'Could you clarify what you mean by…?' · 'I hadn't considered that, but…' · 'That is an important limitation to my argument.'",
          "What not to do: Don't answer before thinking; don't recite a chunk of your commentary; don't dodge the question; don't pretend to know something you don't; don't answer only yes or no; don't become aggressive when you disagree; don't repeat the same idea."
        ],
        "model": "A weak answer vs a strong one: Q: 'Isn't closing the plant simply necessary?' Weak: 'Yes.' Strong: 'It may be necessary for decarbonisation, although the document shows the cost falls on one community — which is why the real issue is how the transition is handled.'",
        "commonError": "Avoid: Answering 'yes' and stopping, or reciting part of your commentary. Better: A direct answer, justified, qualified, tied back to the document.",
        "practice": [
          {
            "q": "If you don't understand a question, you should…",
            "opts": [
              "Guess and hope",
              "Ask for clarification politely",
              "Stay silent",
              "Answer a different question"
            ],
            "answer": 1,
            "feedback": "'Could you clarify what you mean by…?'"
          },
          {
            "q": "If a question exposes an error in your presentation, you should…",
            "opts": [
              "Deny it",
              "Acknowledge the limitation and adjust",
              "Change the subject",
              "Repeat the error"
            ],
            "answer": 1,
            "feedback": "Owning a limit shows maturity."
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Handling the discussion”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "If a question exposes an error in your presentation, you should…",
          "opts": [
            "Deny it",
            "Acknowledge the limitation and adjust",
            "Change the subject",
            "Repeat the error"
          ],
          "answer": 1,
          "feedback": "Owning a limit shows maturity."
        },
        "feedback": {
          "success": "You applied the core method for handling the discussion and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    },
    {
      "id": "M15",
      "domain": "methodology",
      "stage": 4,
      "order": 16,
      "title": "Full colle simulator",
      "short": "Putting it all together",
      "prereq": [
        "M15"
      ],
      "source": "methodology.html#m15",
      "diagnostic": {
        "q": "Which action best matches “Full colle simulator”?",
        "opts": [
          "Putting it all together",
          "Ignore the document",
          "Translate every word"
        ],
        "answer": 0,
        "feedback": ""
      },
      "mission": {
        "learn": [
          "How the simulator works: Choose a country and a document, set your preparation and speaking times, then move through the full arc: discover, take notes, select essentials, add context, find the tension, write the key question, build the outline, choose examples, prepare intro and conclusion, then speak and self-assess against a criteria grid.",
          "An honest tool: The simulator structures and times your work and saves your notes locally. It does not grade the content of open production automatically — no static page can. Compare your work against the criteria grid, and above all bring it to a real colle for a teacher's feedback."
        ],
        "model": "Your document: The simulator pulls a genuine article of the day so you practise on fresh material every time — exactly like a real colle.",
        "commonError": "Avoid: Rushing straight to speaking with no notes or key question. Better: Following the arc: essentials → context → tension → question → outline → examples → intro/conclusion → speak.",
        "practice": [
          {
            "q": "Which action best matches “Full colle simulator”?",
            "opts": [
              "Putting it all together",
              "Ignore the document",
              "Translate every word"
            ],
            "answer": 0,
            "feedback": ""
          }
        ],
        "say": "Explain aloud, in your own words, the central method behind “Full colle simulator”.",
        "useIt": "Apply this method to the next document you prepare for class or a colle, then note one result or correction.",
        "check": {
          "q": "Which action best matches “Full colle simulator”?",
          "opts": [
            "Putting it all together",
            "Ignore the document",
            "Translate every word"
          ],
          "answer": 0,
          "feedback": ""
        },
        "feedback": {
          "success": "You applied the core method for full colle simulator and selected the answer that matches the purpose of the task. The skill will return later in a less guided form.",
          "partial": "You recognised part of the method, but one step or distinction still needs attention. Review the model before applying it to a new document.",
          "retry": "This method is not secure yet. Return to the lesson, identify the exact purpose of the step, and try the check again."
        }
      }
    }
  ]
};
