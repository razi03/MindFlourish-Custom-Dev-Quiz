import Header from "../components/Header";
import { useState, useEffect, useRef } from "react";
import { useQuizAnswers } from "../context/QuizAnswersContext";
import { calculateQuizResults } from "../utils/quizScoring";
import { Check, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";


const QuizPlan = () => {
  // 15 minute countdown timer
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const { answers } = useQuizAnswers();
  const quizResults = calculateQuizResults(answers);
  const paymentRef = useRef(null);

  
  // Calculate user's anxiety type
  const results = calculateQuizResults(answers);
 

  // Centralized image path for before/after comparison
  const beforeAfterImage = "/QuizDesign/female - now_goal.png";
  const [selectedPayment, setSelectedPayment] = useState('one-time');
  const name = answers.name || "";
  const gender = answers.gender || "";
  const email = answers.email_preference?.email || "";
  const phone = answers.email_preference?.phone || "";
  const anxietyType = results.dominantType;
  const severity = results.severity;
  const buildPaymentUrl = (baseUrl: string): string => {
  const params = new URLSearchParams({
      name,
      gender,
      email,
      phone,
      anxietyType,
      severity,
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const paymentOptions = [
    {
      id: 'one-time',
      label: 'ONE TIME PAYMENT',
      price: '$70.00',
      originalPrice: '$147.00',
      discount: '52% Discount',
      popular: true,
      url: buildPaymentUrl('https://facebook.com'), // Replace with real URL
    },
    {
      id: 'installment',
      label: '3X INSTALLMENT PLAN',
      price: '$25.00',
      originalPrice: '$49.00',
      discount: '49% Discount',
      popular: false,
      url: buildPaymentUrl('https://google.com'), // Replace with real URL
    },
  ];

  // Continue button handler
  const handleContinue = () => {
    const selectedOption = paymentOptions.find(opt => opt.id === selectedPayment);
    if (selectedOption && selectedOption.url) {
      window.open(selectedOption.url, '_blank');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer component for header
  const TimerDisplay = () => (
    <div className="flex flex-col items-center gap-2 w-full sm:flex-row sm:justify-end sm:items-center sm:gap-4">
      <span className="text-white text-xs sm:text-sm font-medium text-center sm:text-right w-full sm:w-auto whitespace-nowrap overflow-hidden text-ellipsis">
        Discount ends in {formatTime(timeLeft)}
      </span>
      <button
        className="bg-flourishmint hover:bg-green-400 text-white w-full sm:w-auto px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-colors"
        onClick={() => paymentRef.current?.scrollIntoView({ behavior: 'smooth' })}
      >
        GET MY PLAN
      </button>
    </div>
  );

  // Content based on anxiety type
  const getAnxietyContent = () => {
    switch (anxietyType) {
      case "panic":
        return {
          currentExperience: {
            mainPoints: [
              "Sudden body jolts, pounding heart, tight chest",
              "Fear hits without warning or clear reason", 
              "Breathing feels shallow or stuck"
            ],
            focusAreas: [
              "Stuck in \"what if\" panic spirals",
              "Hard to feel safe even when nothing's wrong",
              "Can't seem to anchor or calm down"
            ]
          },
          calmResetVision: {
            mainPoints: [
              "Early signals are noticed and softened",
              "Body and breath begin responding with more ease",
              "You feel grounded even when anxiety shows up"
            ],
            focusAreas: [
              "CBT Focus: Exposure to physical cues, response flexibility",
              "MCT Focus: Detached awareness of panic loops",
              "CBH Focus: Anchored calm, breath-body safety memory"
            ]
          }
        };
      case "avoidant":
        return {
          currentExperience: {
            mainPoints: [
              "You avoid things that matter to you",
              "Fear of discomfort stops you from starting",
              "Even small tasks feel overwhelming"
            ],
            focusAreas: [
              "Your mind jumps to the worst-case scenario",
              "You freeze or stall instead of moving forward",
              "Emotionally drained from constantly holding back"
            ]
          },
          calmResetVision: {
            mainPoints: [
              "You start, even if it feels uncertain",
              "You speak up without bracing for judgment",
              "You choose presence over protection"
            ],
            focusAreas: [
              "CBT Focus: Gradual re-engagement, structured action",
              "MCT Focus: Unhooking meaning from fear triggers", 
              "CBH Focus: Inner courage, grounded regulation in discomfort"
            ]
          }
        };
      case "ruminator":
        return {
          currentExperience: {
            mainPoints: [
              "Mind loops through \"what ifs\" and replays",
              "Constant overthinking blocks decisions",
              "Mental exhaustion builds from trying to figure it all out"
            ],
            focusAreas: [
              "Thought-labeling, mental pattern rewiring",
              "Over-attachment to thinking as control",
              "No pause between thoughts, overstimulated system"
            ]
          },
          calmResetVision: {
            mainPoints: [
              "Thoughts still come, but no longer spiral",
              "Space returns between ideas, reactions, and clarity",
              "You rest not because it's done, but because you've shifted your relationship with the loop"
            ],
            focusAreas: [
              "CBT Focus: Journaling with thought distance",
              "MCT Focus: Detached mindfulness, attention training",
              "CBH Focus: Slower brainwave states, internal calm rituals"
            ]
          }
        };
      default:
        return {
          currentExperience: {
            mainPoints: [
              "Analyzing your specific anxiety patterns",
              "Understanding your unique triggers",
              "Identifying your response patterns"
            ],
            focusAreas: [
              "Personalized assessment in progress",
              "Custom recommendations being prepared",
              "Tailored approach being developed"
            ]
          },
          calmResetVision: {
            mainPoints: [
              "Customized calm strategies",
              "Personalized coping techniques",
              "Individual progress pathway"
            ],
            focusAreas: [
              "CBT Focus: Personalized cognitive strategies",
              "MCT Focus: Custom mindfulness approaches",
              "CBH Focus: Individual nervous system regulation"
            ]
          }
        };
    }
  };

  const content = getAnxietyContent();

  return (
    <div className="min-h-screen flex flex-col font-inter bg-flourishwhite">
      <div className="w-full sticky top-0 z-10">
        <Header timer={<TimerDisplay />} />
      </div>
      
      <main className="flex-1 px-2 sm:px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
              Best-Fit Therapeutic Techniques for You:
            </h1>
          </div>

          {/* Now vs Goal Section */}
          <div className="mb-10 sm:mb-16">
            {/* Image with absolutely positioned headings */}
            <div className="relative w-full sm:w-[600px] mx-auto mb-6 sm:mb-8 flex justify-center">
              {/* Headings for desktop */}
              <span className="hidden sm:block absolute top-[-32px] left-[18%] z-10">
                <span className="bg-gray-800 text-white text-xs font-semibold px-4 py-1 rounded-lg shadow relative">
                  Now
                  <span className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></span>
                </span>
              </span>
              <span className="hidden sm:block absolute top-[-32px] left-[68%] z-10">
                <span className="bg-emerald-400 text-white text-xs font-semibold px-4 py-1 rounded-lg shadow relative">
                  Your Goal
                  <span className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-emerald-400"></span>
                </span>
              </span>
              {/* Headings for mobile */}
              <div className="flex sm:hidden w-full justify-between absolute top-[-32px] left-0 px-4">
                <span className="bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                  Now
                </span>
                <span className="bg-emerald-400 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                  Your Goal
                </span>
              </div>
              <img 
                src={beforeAfterImage}
                alt="Before and after transformation comparison" 
                className="w-full sm:w-[600px] h-40 sm:h-[300px] object-contain mx-auto"
              />
            </div>
            {/* Now and Goal cards below the image */}
            <div className="flex flex-col sm:flex-row justify-center items-start gap-4 sm:gap-8">
              {/* Now Section */}
              <div className="text-center w-full sm:w-auto">
                {/* Progress bars card */}
                <div className="bg-white border border-gray-500 rounded-lg p-4 sm:p-6 shadow-sm w-full sm:w-80 h-56 sm:h-64 flex flex-col justify-between">
                  <div className="space-y-3 sm:space-y-4 text-left">
                    {/* Energy Level */}
                    <div>
                      <div className="text-sm text-gray-800 mb-1 font-semibold">
                        Energy Level
                      </div>
                      <div className="text-xs text-green-600 mb-2 font-medium">Low</div>
                      <hr className="my-2 border-gray-200" />
                    </div>

                    {/* Well-being Level */}
                    <div>
                      <div className="text-sm text-gray-800 mb-1 font-semibold">
                        Well-being Level
                      </div>
                      <div className="text-xs text-green-600 mb-2 font-medium">Weak</div>
                      <div className="flex space-x-1 sm:space-x-2 my-2">
                        <div className="h-2 w-1/4 rounded bg-emerald-400"></div>
                        <div className="h-2 w-1/4 rounded bg-emerald-200"></div>
                        <div className="h-2 w-1/4 rounded bg-gray-200"></div>
                        <div className="h-2 w-1/4 rounded bg-gray-200"></div>
                      </div>
                      <hr className="my-2 border-gray-200" />
                    </div>

                    {/* Self-esteem Level */}
                    <div>
                      <div className="text-sm text-gray-800 mb-1 font-semibold">
                        Self-esteem Level
                      </div>
                      <div className="text-xs text-green-600 mb-2 font-medium">Low</div>
                      <div className="relative w-full h-3 bg-gray-200 rounded-full mt-3 mb-1">
                        <div className="absolute left-0 top-0 h-3 bg-emerald-400 rounded-full" style={{ width: '25%' }}></div>
                        <div className="absolute top-1/2 left-[25%] transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-emerald-400 rounded-full shadow"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Section */}
              <div className="text-center w-full sm:w-auto mt-4 sm:mt-0">
                {/* Progress bars card */}
                <div className="bg-white border border-gray-500 rounded-lg p-4 sm:p-6 shadow-sm w-full sm:w-80 h-56 sm:h-64 flex flex-col justify-between">
                  <div className="space-y-3 sm:space-y-4 text-left">
                    {/* Energy Level */}
                    <div>
                      <div className="flex justify-between items-center text-sm text-gray-800 mb-1 font-semibold">
                        <span>Energy Level</span>
                      </div>
                      <div className="text-xs text-green-600 mb-2 font-medium">High</div>
                      <hr className="my-2 border-gray-200" />
                    </div>
                    {/* Well-being Level */}
                    <div>
                      <div className="flex justify-between items-center text-sm text-gray-800 mb-1 font-semibold">
                        <span>Well-being Level</span>
                      </div>
                      <div className="text-xs text-green-600 mb-2 font-medium">Strong</div>
                      <div className="flex space-x-1 sm:space-x-2 my-2">
                        <div className="h-2 w-1/4 rounded bg-emerald-400"></div>
                        <div className="h-2 w-1/4 rounded bg-emerald-400"></div>
                        <div className="h-2 w-1/4 rounded bg-emerald-400"></div>
                        <div className="h-2 w-1/4 rounded bg-emerald-400"></div>
                      </div>
                      <hr className="my-2 border-gray-200" />
                    </div>
                    {/* Self-esteem Level */}
                    <div>
                      <div className="flex justify-between items-center text-sm text-gray-800 mb-1 font-semibold">
                        <span>Self-esteem Level</span>
                      </div>
                      <div className="text-xs text-green-600 mb-2 font-medium">High</div>
                      <div className="relative w-full h-3 bg-gray-200 rounded-full mt-3 mb-1">
                        <div className="absolute left-0 top-0 h-3 bg-emerald-400 rounded-full" style={{ width: '85%' }}></div>
                        <div className="absolute top-1/2 left-[85%] transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-emerald-400 rounded-full shadow"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Experience and Calm Reset Vision Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12 mb-10 sm:mb-16">
            {/* Current Experience */}
            <div className="w-full max-w-xs sm:max-w-sm mx-auto sm:mx-0 mb-6 sm:mb-0">
              <div className="bg-flourishgreen text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-center font-semibold mb-4">
                Current Experience
              </div>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-gray-700 text-xs sm:text-sm font-medium italic">
                  "What You're Navigating Now"
                </h3>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <ul className="space-y-2 sm:space-y-3">
                  {content.currentExperience.mainPoints.map((point, index) => (
                    <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
                      <span className="text-gray-400 mr-2 sm:mr-3">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-2 sm:mb-4">
                <h4 className="text-flourishmint font-semibold text-xs sm:text-sm mb-2 sm:mb-3">
                  Focus Areas:
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {content.currentExperience.focusAreas.map((area, index) => (
                    <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
                      <span className="text-gray-400 mr-2 sm:mr-3">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Calm Reset Vision */}
            <div className="w-full max-w-xs sm:max-w-sm mx-auto sm:mx-0">
              <div className="bg-flourishgreen text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-center font-semibold mb-4">
                Calm Reset Vision
              </div>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-gray-700 text-xs sm:text-sm font-medium italic">
                  "What We're Supporting You Toward"
                </h3>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <ul className="space-y-2 sm:space-y-3">
                  {content.calmResetVision.mainPoints.map((point, index) => (
                    <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
                      <span className="text-gray-400 mr-2 sm:mr-3">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-2 sm:mb-4">
                <h4 className="text-flourishmint font-semibold text-xs sm:text-sm mb-2 sm:mb-3">
                  Focus Areas:
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {content.calmResetVision.focusAreas.map((area, index) => (
                    <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
                      <span className="text-gray-400 mr-2 sm:mr-3">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div ref={paymentRef} className="mb-16 max-w-md mx-auto space-y-4">
        {paymentOptions.map((option) => (
          <div key={option.id} className="relative">
            {option.popular && (
              <div className="bg-flourishgreen text-white text-center py-2 rounded-t-lg">
                <span className="text-sm font-medium flex items-center justify-center gap-1">
                  ★ Most Popular!
                </span>
              </div>
            )}
            <label
              htmlFor={option.id}
              className={`bg-white border border-gray-200 rounded-b-lg p-4 flex items-center justify-between cursor-pointer ${
                selectedPayment === option.id ? 'ring-2 ring-flourishmint' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id={option.id}
                  name="payment"
                  className="w-4 h-4 accent-green-700"
                  checked={selectedPayment === option.id}
                  onChange={() => setSelectedPayment(option.id)}
                />
                <span className="font-semibold text-gray-900">{option.label}</span>
              </div>
              <div className="text-right">
                <div className="bg-flourishmint text-white px-3 py-1 rounded text-sm font-bold">
                  {option.price}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="line-through">{option.originalPrice}</span>
                </div>
                <div className="text-xs text-flourishmint font-medium">{option.discount}</div>
              </div>
            </label>
          </div>
        ))}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full bg-flourishmint hover:bg-green-400 text-white py-3 rounded-full text-base font-semibold shadow-md transition duration-150 hover:scale-105 hover:brightness-110"
        >
          Continue
        </button>
      </div>

          {/* Free Trial Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Try the 7-Day Anxiety Reset — Free
            </h2>
            <p className="text-gray-700 mb-2 font-medium">
              Your Calm Reset Plan is ready.
            </p>
            <p className="text-gray-600 text-sm mb-6">
              Access the first 7 days at no cost and start rewiring your anxiety response today.
            </p>
            
            <div className="bg-gray-800 text-white px-4 py-2 rounded-full inline-block mb-6">
              <span className="text-sm font-medium">You'll receive:</span>
            </div>
            
            <div className="max-w-sm mx-auto space-y-2 mb-8">
              <div className="text-sm text-gray-700 text-left">• Daily MCT tools for overthinking release</div>
              <div className="text-sm text-gray-700 text-left">• CBT-based action steps to reduce avoidance</div>
              <div className="text-sm text-gray-700 text-left">• Soothing CBH audio tracks to calm your system</div>
            </div>
            
            <button
              onClick={() => window.open(buildPaymentUrl("https://www.linkedin.com"), "_blank")}
              className="bg-flourishmint hover:bg-green-400 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Start My Free 7 Day Trial
            </button>
          </div>
          <hr className="my-2 border-gray-300 border-t-4 mb-8" />
          {/* Our Goals for You Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Our Goals for You
            </h2>
            <div className="max-w-sm mx-auto space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-flourishmint rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Help you feel calmer throughout your day</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-flourishmint rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Stop the spiral before it begins</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-flourishmint rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Improve clarity, energy, and sleep</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-flourishmint rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Build emotional resilience with lasting strategies</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-flourishmint rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Support you without overwhelm</span>
              </div>
            </div>
          </div>
           <hr className="my-2 border-gray-300 border-t-4 mb-8" />
          {/* Therapy Results + Life Without vs. With Support Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Therapy Results + 
            </h2>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              "Life Without vs. With Support"
            </h2>
            
            <p className="text-gray-700 text-sm mb-8">
              Success rates from clinical methods:
            </p>
            
            {/* Graphic representation */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative w-80 h-40">
                {/* Image placeholders */}
                <div className="absolute top-1/2 left-1/2 w-96 h-64 transform -translate-x-1/2 -translate-y-1/2">
                  <img 
                    src="/QuizDesign/with_without support (2).png" 
                    alt="Without support illustration" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mb-6 max-w-md mx-auto">
              Research shows CBT can be effective for up to 70% of individuals. MCT and CBH have also demonstrated high success rates, especially when integrated. Our approach offers a more complete path with lasting results.
            </p>
            
            <p className="text-sm font-semibold text-gray-800 mb-8">
              Estimated combined approach success: up to 90%
            </p>
            
            {/* Comparison columns */}
            <div className="flex justify-center gap-8 max-w-2xl mx-auto">
              <div className="flex-1">
                <div className="bg-flourishgreen text-white  px-4 py-2 rounded-full mb-4">
                  <span className="text-sm font-medium">Without Support:</span>
                </div>
                <ul className="space-y-2 text-left text-sm text-gray-700">
                  <li>• You may continue battling the same cycles</li>
                  <li>• Your nervous system stays reactive</li>
                  <li>• Daily life feels heavier than it needs to</li>
                </ul>
              </div>
              
              <div className="flex-1">
                <div className="bg-flourishgreen text-white px-4 py-2 rounded-full mb-4">
                  <span className="text-sm font-medium">With Calm Reset:</span>
                </div>
                <ul className="space-y-2 text-left text-sm text-gray-700">
                  <li>• Thought spirals become less intense</li>
                  <li>• You feel cleaner, lighter, and more focused</li>
                  <li>• You build emotional safety from within</li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-2 border-gray-300 border-t-4 mb-8" />

          {/* Frequently Asked Questions Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="diagnosis" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="bg-flourishgreen text-white px-4 py-3 rounded-lg hover:no-underline">
                    <span className="font-medium">Q: Do I need a diagnosis?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-white rounded-b-lg">
                    <p className="text-gray-700">A: No. This quiz and plan are designed to support anyone experiencing anxiety symptoms.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="therapy" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="bg-flourishgreen text-white px-4 py-3 rounded-lg hover:no-underline">
                    <span className="font-medium">Q: Is this therapy?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-white rounded-b-lg">
                    <p className="text-gray-700">A: It's not formal therapy, but it is built on real clinical approaches used in therapy settings.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="cbt" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="bg-flourishgreen text-white px-4 py-3 rounded-lg hover:no-underline">
                    <span className="font-medium">Q: What if I've already tried CBT?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-white rounded-b-lg">
                    <p className="text-gray-700">A: This combines CBT with other tools that address overthinking and subconscious reactions.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="results" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="bg-flourishgreen text-white px-4 py-3 rounded-lg hover:no-underline">
                    <span className="font-medium">Q: How fast can I feel results?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-white rounded-b-lg">
                    <p className="text-gray-700">A: Some people feel a shift within 1–2 weeks. Most see significant change within 4–6 weeks.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="daily" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="bg-flourishgreen text-white px-4 py-3 rounded-lg hover:no-underline">
                    <span className="font-medium">Q: Do I have to use it every day?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-white rounded-b-lg">
                    <p className="text-gray-700">A: No. You'll learn tools you can return to when needed. This is flexible, not rigid.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <hr className="my-2 border-gray-300 border-t-4 mb-8" />

          {/* Testimonials Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Testimonials
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[ 
              "This is the first plan that actually matched how I think. It finally felt designed for someone like me.",
              "I used to spiral every evening. Now I have a way to stop it before it starts.",
              "I didn't think I'd ever feel calm again but this gave me back hope."
            ].map((text, idx) => (
              <div key={idx} className="bg-white border border-gray-400 rounded-lg p-8 text-left relative shadow-2xl">
                {/* Comma image positioned half inside/outside top-left */}
                <img
                  src="/Icons/85.png"
                  alt="Quotation mark"
                  className="absolute top-0 left-9 -translate-x-1/2 -translate-y-1/2 w-10 h-10 opacity-70 pointer-events-none"
                />
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {text}
                </p>
                 <hr className="my-2 border-gray-500" />
                <div className="flex mb-0">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-flourishmint text-lg">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          </div>
          
           <hr className="my-2 border-gray-300 border-t-4 mb-8" />
          {/* Final Pricing Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Begin Your Calm Reset Plan
            </h2>
            
            <div className="mb-16 max-w-md mx-auto space-y-4">
            {paymentOptions.map((option) => (
              <div key={option.id} className="relative">
                {option.popular && (
                  <div className="bg-flourishgreen text-white text-center py-2 rounded-t-lg">
                    <span className="text-sm font-medium flex items-center justify-center gap-1">
                      ★ Most Popular!
                    </span>
                  </div>
                )}
                <label
                  htmlFor={option.id}
                  className={`bg-white border border-gray-200 rounded-b-lg p-4 flex items-center justify-between cursor-pointer ${
                    selectedPayment === option.id ? 'ring-2 ring-flourishmint' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id={option.id}
                      name="payment"
                     className="w-4 h-4 accent-green-700"
                      checked={selectedPayment === option.id}
                      onChange={() => setSelectedPayment(option.id)}
                    />
                    <span className="font-semibold text-gray-900">{option.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="bg-flourishmint text-white px-3 py-1 rounded text-sm font-bold">
                      {option.price}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="line-through">{option.originalPrice}</span>
                    </div>
                    <div className="text-xs text-flourishmint font-medium">{option.discount}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
            {/* Completion Message */}
            <div className="mt-8 mb-6">
              <p className="text-gray-800 font-semibold mb-2">
                You've completed your anxiety profile.
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Your path to clarity, calm, and confidence begins right here.
              </p>
              <p className="text-gray-600 text-sm">
                We've prepared your tools, based on what your system truly needs.
              </p>
            </div>

            {/* Start My Plan Button */}
            <button 
              className="bg-flourishmint hover:bg-green-400 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors"
              onClick={handleContinue}
            >
              Start My Plan Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPlan;
