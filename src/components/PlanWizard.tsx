import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShoppingCart, 
  FileText, 
  LayoutDashboard, 
  Users, 
  Briefcase,
  Code,
  Check,
  Database,
  Lock,
  CreditCard,
  Bell,
  Search,
  MessageSquare,
  Image,
  Calendar,
  Hotel,
  UtensilsCrossed,
  GraduationCap,
  Dumbbell,
  Home,
  Stethoscope,
  Plane,
  Car,
  Music,
  Gamepad2,
  Heart,
  Baby,
  Dog,
  Flower2,
  Scissors,
  Hammer,
  Scale,
  Building2,
  Landmark,
  Church,
  Newspaper,
  Radio,
  Film,
  Camera,
  Palette,
  BookOpen,
  Truck,
  Package,
  Coffee,
  Wine,
  Shirt,
  Gem,
  Smartphone,
  MapPin,
  Ticket,
  Gift,
  Sparkle,
  Zap,
  Banknote,
  PiggyBank,
  Bitcoin,
  TrendingUp,
  UserSearch,
  UserPlus,
  Tractor,
  Wheat,
  Wrench,
  Factory,
  Trophy,
  Dices,
  HeartHandshake,
  Apple,
  ShoppingBasket,
  Box,
  Gavel,
  Sofa,
  HardHat,
  Cog,
  Library,
  Building,
  Clapperboard,
  Smile,
  Brain,
  Eye,
  Sticker,
  PawPrint,
  Bike,
  Anchor,
  Sailboat,
  Mountain,
  Tent,
  Trees,
  Recycle,
  Sun,
  Lightbulb,
  Printer,
  PenTool,
  Glasses,
  Watch,
  Cigarette,
  Pill,
  TestTube,
  Microscope,
  Atom,
  Rocket,
  Satellite,
  Shield,
  Lock as LockIcon,
  Key,
  Wifi,
  Server,
  Cloud,
  Store,
  Warehouse,
  Container,
  Forklift,
  Bus,
  Train,
  Ship,
  Fuel,
  Droplets,
  Flame,
  Wind,
  Leaf,
  Fish,
  Bird,
  Rabbit,
  Cat,
  Bone
} from "lucide-react";

interface PlanWizardProps {
  open: boolean;
  onClose: () => void;
  onGeneratePlan: (planData: PlanData) => void;
}

export interface PlanData {
  projectType: string;
  projectName: string;
  features: string[];
  additionalDetails: string;
}

const projectTypes = [
  // E-commerce & Retail
  { id: "ecommerce", label: "E-commerce Store", icon: ShoppingCart, description: "Online shop with products & checkout" },
  { id: "marketplace", label: "Marketplace", icon: Building2, description: "Multi-vendor platform" },
  { id: "fashion", label: "Fashion & Apparel", icon: Shirt, description: "Clothing & accessories store" },
  { id: "jewelry", label: "Jewelry & Luxury", icon: Gem, description: "High-end products & accessories" },
  { id: "electronics", label: "Electronics Store", icon: Smartphone, description: "Gadgets & tech products" },
  { id: "grocery", label: "Grocery & Supermarket", icon: ShoppingBasket, description: "Online grocery shopping" },
  { id: "subscription", label: "Subscription Box", icon: Box, description: "Recurring product deliveries" },
  { id: "auction", label: "Auction Platform", icon: Gavel, description: "Bidding & auctions" },
  
  // Food & Hospitality
  { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed, description: "Food ordering & reservations" },
  { id: "hotel", label: "Hotel & Hospitality", icon: Hotel, description: "Room booking & management" },
  { id: "cafe", label: "Cafe & Coffee Shop", icon: Coffee, description: "Menu & online ordering" },
  { id: "bar", label: "Bar & Nightclub", icon: Wine, description: "Events & reservations" },
  { id: "fooddelivery", label: "Food Delivery", icon: Truck, description: "Delivery platform & tracking" },
  { id: "bakery", label: "Bakery & Pastry", icon: Store, description: "Baked goods & orders" },
  { id: "catering", label: "Catering Service", icon: UtensilsCrossed, description: "Event catering & menus" },
  
  // Health & Wellness
  { id: "healthcare", label: "Healthcare & Medical", icon: Stethoscope, description: "Patient management & appointments" },
  { id: "fitness", label: "Fitness & Gym", icon: Dumbbell, description: "Memberships & workout tracking" },
  { id: "spa", label: "Spa & Wellness", icon: Sparkle, description: "Booking & treatments" },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, description: "Medicine & prescriptions" },
  { id: "dental", label: "Dental Clinic", icon: Smile, description: "Dental appointments & records" },
  { id: "mentalhealth", label: "Mental Health", icon: Brain, description: "Therapy & counseling platform" },
  { id: "optical", label: "Optical & Eyewear", icon: Eye, description: "Eye care & glasses" },
  { id: "veterinary", label: "Veterinary Clinic", icon: PawPrint, description: "Pet health & appointments" },
  { id: "laboratory", label: "Lab & Diagnostics", icon: TestTube, description: "Medical testing & results" },
  
  // Education & Learning
  { id: "education", label: "Education Platform", icon: GraduationCap, description: "Courses & learning management" },
  { id: "school", label: "School & University", icon: BookOpen, description: "Student & course management" },
  { id: "tutoring", label: "Tutoring & Coaching", icon: Users, description: "1-on-1 learning sessions" },
  { id: "library", label: "Digital Library", icon: Library, description: "Book lending & resources" },
  { id: "training", label: "Corporate Training", icon: Briefcase, description: "Employee learning & development" },
  
  // Real Estate & Property
  { id: "realestate", label: "Real Estate", icon: Home, description: "Property listings & management" },
  { id: "rental", label: "Rental Platform", icon: Building2, description: "Short & long-term rentals" },
  { id: "propertymanagement", label: "Property Management", icon: Landmark, description: "Building & tenant management" },
  { id: "coworking", label: "Coworking Space", icon: Building, description: "Office space & desk booking" },
  { id: "interiordesign", label: "Interior Design", icon: Sofa, description: "Design services & portfolios" },
  
  // Finance & Banking
  { id: "banking", label: "Banking & Finance", icon: Banknote, description: "Banking services & accounts" },
  { id: "insurance", label: "Insurance", icon: Shield, description: "Insurance policies & claims" },
  { id: "investment", label: "Investment Platform", icon: TrendingUp, description: "Trading & portfolio management" },
  { id: "crypto", label: "Cryptocurrency", icon: Bitcoin, description: "Crypto trading & wallets" },
  { id: "lending", label: "Lending & Loans", icon: PiggyBank, description: "Loan applications & management" },
  { id: "crowdfunding", label: "Crowdfunding", icon: HeartHandshake, description: "Fundraising campaigns" },
  
  // Travel & Transportation
  { id: "travel", label: "Travel & Tourism", icon: Plane, description: "Bookings & trip planning" },
  { id: "carservice", label: "Car Service & Rental", icon: Car, description: "Vehicle booking & fleet management" },
  { id: "logistics", label: "Logistics & Shipping", icon: Package, description: "Delivery & tracking" },
  { id: "taxi", label: "Taxi & Rideshare", icon: Car, description: "Ride booking & dispatch" },
  { id: "bus", label: "Bus & Coach", icon: Bus, description: "Bus ticketing & schedules" },
  { id: "airlines", label: "Airlines", icon: Plane, description: "Flight booking & management" },
  { id: "cruise", label: "Cruise & Ferry", icon: Ship, description: "Maritime travel booking" },
  { id: "parking", label: "Parking Management", icon: Car, description: "Parking spots & payments" },
  { id: "moving", label: "Moving & Storage", icon: Truck, description: "Relocation services" },
  
  // Recruitment & HR
  { id: "jobboard", label: "Job Board", icon: UserSearch, description: "Job listings & applications" },
  { id: "recruitment", label: "Recruitment Agency", icon: UserPlus, description: "Hiring & talent acquisition" },
  { id: "hrmanagement", label: "HR Management", icon: Users, description: "Employee management & payroll" },
  { id: "freelance", label: "Freelance Marketplace", icon: Briefcase, description: "Freelancer hiring & projects" },
  
  // Professional Services
  { id: "saas", label: "SaaS Product", icon: Zap, description: "Software as a service" },
  { id: "agency", label: "Agency & Consulting", icon: Briefcase, description: "Client & project management" },
  { id: "legal", label: "Legal Services", icon: Scale, description: "Case & client management" },
  { id: "accounting", label: "Accounting & Finance", icon: CreditCard, description: "Financial management" },
  { id: "marketing", label: "Marketing Agency", icon: TrendingUp, description: "Campaign & client management" },
  
  // Entertainment & Media
  { id: "social", label: "Social Platform", icon: Users, description: "User profiles & social features" },
  { id: "streaming", label: "Streaming & Media", icon: Film, description: "Video/audio content platform" },
  { id: "gaming", label: "Gaming Platform", icon: Gamepad2, description: "Games & community" },
  { id: "music", label: "Music Platform", icon: Music, description: "Audio streaming & artists" },
  { id: "podcast", label: "Podcast Platform", icon: Radio, description: "Audio content & subscriptions" },
  { id: "news", label: "News & Magazine", icon: Newspaper, description: "Articles & subscriptions" },
  { id: "cinema", label: "Cinema & Theater", icon: Clapperboard, description: "Movie tickets & showtimes" },
  { id: "dating", label: "Dating App", icon: Heart, description: "Matchmaking & connections" },
  
  // Sports & Recreation
  { id: "sports", label: "Sports Club", icon: Trophy, description: "Team & league management" },
  { id: "fantasysports", label: "Fantasy Sports", icon: Dices, description: "Fantasy leagues & betting" },
  { id: "outdoor", label: "Outdoor & Adventure", icon: Mountain, description: "Tours & activities" },
  { id: "camping", label: "Camping & RV", icon: Tent, description: "Campsite booking" },
  { id: "cycling", label: "Cycling & Bikes", icon: Bike, description: "Bike rentals & tours" },
  { id: "watersports", label: "Water Sports", icon: Sailboat, description: "Boat rentals & lessons" },
  
  // Agriculture & Farming
  { id: "agriculture", label: "Agriculture & Farming", icon: Tractor, description: "Farm management & sales" },
  { id: "farmmarket", label: "Farm Marketplace", icon: Wheat, description: "Agricultural products" },
  { id: "gardening", label: "Gardening & Nursery", icon: Trees, description: "Plants & landscaping" },
  
  // Manufacturing & Industry
  { id: "manufacturing", label: "Manufacturing", icon: Factory, description: "Production & inventory" },
  { id: "construction", label: "Construction", icon: HardHat, description: "Project management & tracking" },
  { id: "automotive", label: "Car Dealership", icon: Car, description: "Vehicle sales & service" },
  { id: "autoparts", label: "Auto Parts", icon: Wrench, description: "Parts inventory & sales" },
  { id: "warehouse", label: "Warehouse Management", icon: Warehouse, description: "Inventory & logistics" },
  
  // Energy & Utilities
  { id: "energy", label: "Energy & Utilities", icon: Lightbulb, description: "Utility services & billing" },
  { id: "solar", label: "Solar & Renewable", icon: Sun, description: "Clean energy services" },
  { id: "fuel", label: "Fuel & Gas Station", icon: Fuel, description: "Fuel sales & loyalty" },
  { id: "water", label: "Water Services", icon: Droplets, description: "Water utility management" },
  
  // Technology & IT
  { id: "itservices", label: "IT Services", icon: Server, description: "Tech support & consulting" },
  { id: "hosting", label: "Web Hosting", icon: Cloud, description: "Hosting & domains" },
  { id: "security", label: "Security Services", icon: Shield, description: "Cybersecurity & monitoring" },
  { id: "telecom", label: "Telecom", icon: Wifi, description: "Communication services" },
  
  // Creative & Arts
  { id: "portfolio", label: "Portfolio & Landing", icon: Palette, description: "Showcase work & services" },
  { id: "photography", label: "Photography", icon: Camera, description: "Gallery & booking" },
  { id: "art", label: "Art & Gallery", icon: Image, description: "Artworks & exhibitions" },
  { id: "printing", label: "Printing Services", icon: Printer, description: "Print shop & design" },
  { id: "design", label: "Design Studio", icon: PenTool, description: "Creative services" },
  
  // Local Services
  { id: "salon", label: "Salon & Beauty", icon: Scissors, description: "Appointments & services" },
  { id: "repair", label: "Repair & Maintenance", icon: Hammer, description: "Service booking & tracking" },
  { id: "cleaning", label: "Cleaning Services", icon: Sparkle, description: "Booking & scheduling" },
  { id: "petservices", label: "Pet Services", icon: Dog, description: "Pet care & grooming" },
  { id: "florist", label: "Florist & Garden", icon: Flower2, description: "Products & delivery" },
  { id: "childcare", label: "Childcare & Daycare", icon: Baby, description: "Booking & management" },
  { id: "laundry", label: "Laundry Services", icon: Shirt, description: "Laundry & dry cleaning" },
  
  // Events & Tickets
  { id: "events", label: "Events Platform", icon: Ticket, description: "Event management & ticketing" },
  { id: "wedding", label: "Wedding & Planning", icon: Heart, description: "Event planning & vendors" },
  { id: "church", label: "Church & Religious", icon: Church, description: "Community & events" },
  { id: "funeral", label: "Funeral Services", icon: Flower2, description: "Memorial services" },
  
  // Content & Publishing
  { id: "blog", label: "Blog / CMS", icon: FileText, description: "Content management & articles" },
  { id: "dashboard", label: "Dashboard / Admin", icon: LayoutDashboard, description: "Data visualization & management" },
  { id: "publishing", label: "Book Publishing", icon: BookOpen, description: "Author & book management" },
  
  // Government & Public
  { id: "government", label: "Government Portal", icon: Landmark, description: "Public services & forms" },
  { id: "voting", label: "Voting & Elections", icon: Check, description: "Election management" },
  
  // Other
  { id: "nonprofit", label: "Non-profit & Charity", icon: Gift, description: "Donations & volunteering" },
  { id: "directory", label: "Directory & Listings", icon: MapPin, description: "Business listings & reviews" },
  { id: "booking", label: "Booking Platform", icon: Calendar, description: "General appointment booking" },
  { id: "recycling", label: "Recycling & Waste", icon: Recycle, description: "Waste management services" },
  { id: "research", label: "Research & Science", icon: Microscope, description: "Scientific research platform" },
  { id: "space", label: "Space & Aerospace", icon: Rocket, description: "Aerospace & satellite" },
  { id: "custom", label: "Custom Project", icon: Code, description: "Something unique" },
];

const featureOptions = [
  { id: "auth", label: "User Authentication", icon: Lock },
  { id: "database", label: "Database Integration", icon: Database },
  { id: "payments", label: "Payment Processing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "search", label: "Search Functionality", icon: Search },
  { id: "chat", label: "Chat / Messaging", icon: MessageSquare },
  { id: "media", label: "Media Upload", icon: Image },
  { id: "scheduling", label: "Scheduling / Calendar", icon: Calendar },
];

export const PlanWizard: React.FC<PlanWizardProps> = ({ open, onClose, onGeneratePlan }) => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState("");

  const resetWizard = () => {
    setStep(1);
    setProjectType("");
    setProjectName("");
    setSelectedFeatures([]);
    setAdditionalDetails("");
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const handleGenerate = () => {
    onGeneratePlan({
      projectType,
      projectName,
      features: selectedFeatures,
      additionalDetails,
    });
    handleClose();
  };

  const canProceed = () => {
    if (step === 1) return projectType !== "";
    if (step === 2) return projectName.trim() !== "";
    if (step === 3) return true;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-neutral-900 border-white/10 p-0 gap-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
        {/* Progress indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Create Your Plan</h2>
            <span className="text-xs text-slate-400">Step {step} of 4</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-sky-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          {/* Step 1: Project Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-white mb-1">What type of project?</h3>
                <p className="text-sm text-slate-400">Select the category that best describes your project</p>
              </div>
              <ScrollArea className="h-[515px] pr-4">
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = projectType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setProjectType(type.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                          isSelected 
                            ? 'border-sky-500 bg-sky-500/10' 
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-sky-500/20' : 'bg-white/10'
                        }`}>
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isSelected ? 'text-sky-300' : 'text-white'}`}>
                            {type.label}
                          </p>
                          <p className="text-xs text-slate-400">{type.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Step 2: Project Name */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Give your project a name</h3>
                <p className="text-xs text-slate-400">This helps personalise your development plan</p>
              </div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., My Awesome Store, TaskMaster App..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                autoFocus
              />
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {["My Portfolio", "Shop App", "Task Manager", "Blog Site"].map((name) => (
                    <button
                      key={name}
                      onClick={() => setProjectName(name)}
                      className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Select key features</h3>
                <p className="text-xs text-slate-400">Choose the features you want in your project</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {featureOptions.map((feature) => {
                  const Icon = feature.icon;
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        isSelected ? 'bg-sky-500' : 'bg-white/10'
                      }`}>
                        {isSelected ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <Icon className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-sky-300' : 'text-slate-300'}`}>
                        {feature.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Any additional details?</h3>
                <p className="text-xs text-slate-400">Share specific requirements or ideas (optional)</p>
              </div>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="e.g., I want a dark theme, the app should support multiple languages, I need integration with Stripe..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 min-h-[120px] resize-none"
              />
              
              {/* Summary */}
              <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
                <p className="text-xs font-medium text-sky-300 mb-2">Plan Summary</p>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>
                    <span className="text-slate-500">Type:</span>{" "}
                    {projectTypes.find(t => t.id === projectType)?.label}
                  </p>
                  <p>
                    <span className="text-slate-500">Name:</span>{" "}
                    {projectName}
                  </p>
                  <p>
                    <span className="text-slate-500">Features:</span>{" "}
                    {selectedFeatures.length > 0 
                      ? selectedFeatures.map(f => featureOptions.find(fo => fo.id === f)?.label).join(", ")
                      : "None selected"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? "Cancel" : "Back"}
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-600 hover:to-indigo-600 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Plan
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
