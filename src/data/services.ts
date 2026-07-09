import { images, type SiteImage } from "./images";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  title: string;
  slug: string;
  short: string;
  hero: string;
  intro: string;
  benefits: string[];
  included: string[];
  process: { step: string; detail: string }[];
  why: string[];
  faqs: ServiceFaq[];
  image: SiteImage;
  gallery: SiteImage[];
  seoTitle: string;
  description: string;
};

export const services: Service[] = [
  {
    title: "Interior & Exterior Painting",
    slug: "interior-exterior-painting",
    short: "Clean lines, durable finishes, and careful prep work for homes, rentals, and commercial spaces.",
    hero: "Painting Built on Preparation, Quality Materials, and Attention to Detail",
    intro: "A quality paint job starts long before the first coat. As a painting contractor serving Pierce, Thurston, King, and Snohomish County, VMG handles interior and exterior painting with careful surface preparation, clean cut lines, products matched to the surface, and a contractor's eye for the whole home — not just the wall in front of us.",
    benefits: [
      "Fresh curb appeal outside and cleaner, brighter rooms inside",
      "Durable finishes selected for each surface and exposure",
      "Better protection against Western Washington rain and moisture",
      "A polished, well-maintained look that adds value to your property"
    ],
    included: [
      "Interior wall and ceiling painting",
      "Exterior house painting",
      "Trim, doors, and baseboard painting",
      "Cabinet painting and accent walls",
      "Deck and fence staining",
      "Surface preparation, repairs, and finish coordination"
    ],
    process: [
      { step: "Walk the project together", detail: "We review the surfaces, conditions, and the look you want." },
      { step: "Prep the surfaces properly", detail: "Walls, trim, siding, and exteriors are cleaned, repaired, and primed as needed." },
      { step: "Protect and paint", detail: "We mask surrounding areas and apply the right products for each surface." },
      { step: "Clean up and walk through", detail: "The site is left clean and we review every area with you." }
    ],
    why: [
      "Over 30 years of hands-on construction experience",
      "Careful prep before any finish work begins",
      "Interior, exterior, residential, and commercial knowledge",
      "Clear communication from estimate to final walkthrough"
    ],
    faqs: [
      {
        question: "Do you paint both interiors and exteriors?",
        answer: "Yes. VMG handles interior painting (walls, ceilings, trim, doors, cabinets) and exterior painting (siding, trim, doors, decks, and fences) for homes and commercial properties across Western Washington."
      },
      {
        question: "When is the best time for exterior painting in Washington?",
        answer: "Late spring through early fall is usually best because exterior paint needs dry surfaces and mild temperatures to cure well. We help you plan the schedule around the weather."
      },
      {
        question: "How do you prepare surfaces before painting?",
        answer: "Preparation depends on the surface, but typically includes cleaning, scraping or sanding loose material, repairing damage, caulking gaps, and priming. Good prep is what makes a paint job last."
      }
    ],
    image: images.painting[0],
    gallery: images.painting,
    seoTitle: "Interior & Exterior Painting in Roy, WA | VMG Painting & Remodeling LLC",
    description: "Professional interior and exterior painting from a family-owned Roy, WA contractor. Careful prep, durable finishes, and clean results across Thurston, Pierce, King, and Snohomish County."
  },
  {
    title: "Siding",
    slug: "siding",
    short: "Siding installation, replacement, and repair that protects your home and improves curb appeal.",
    hero: "Protect Your Home and Improve Curb Appeal With Quality Siding Work",
    intro: "Siding is your home's first line of defense against Western Washington rain, wind, and moisture. As a siding contractor based in Roy, WA, VMG reviews worn, cracked, loose, or faded siding and recommends the practical next step — whether that's a targeted repair or full replacement.",
    benefits: [
      "Stronger protection from moisture, rot, and weather damage",
      "A noticeable boost in curb appeal and home value",
      "Coordinated exterior trim and paint details in one project",
      "A cleaner, tighter exterior envelope that lasts"
    ],
    included: [
      "New siding installation",
      "Full siding replacement",
      "Siding repairs and patching",
      "Exterior trim coordination",
      "Inspection of weather-exposed areas",
      "Exterior refresh projects combined with painting"
    ],
    process: [
      { step: "Inspect the existing siding", detail: "We look for moisture damage, loose boards, gaps, and wear." },
      { step: "Review your options", detail: "Repair, replacement, materials, and finishes — explained plainly." },
      { step: "Install with care", detail: "We prepare the exterior and install materials to shed water correctly." },
      { step: "Detail the transitions", detail: "Trim, windows, and corners are finished cleanly." }
    ],
    why: [
      "Construction-based knowledge of the whole exterior system",
      "Painting, window, and trim coordination in one contractor",
      "Practical recommendations — repair when repair makes sense",
      "Local, family-owned Washington service"
    ],
    faqs: [
      {
        question: "How do I know if my siding needs repair or replacement?",
        answer: "Warping, cracking, soft spots, persistent peeling paint, or moisture inside the wall are common signs. We inspect the siding and tell you honestly whether a repair or a replacement is the smarter investment."
      },
      {
        question: "Can you paint the new siding too?",
        answer: "Yes. Because VMG is both a siding and painting contractor, we can install or repair siding and complete the paint or finish work in one coordinated project."
      },
      {
        question: "Which areas do you serve for siding work?",
        answer: "We install, replace, and repair siding for homeowners across Thurston County, Pierce County, King County, and Snohomish County, Washington."
      }
    ],
    image: images.siding[0],
    gallery: images.siding,
    seoTitle: "Siding Installation & Replacement in Roy, WA | VMG Painting & Remodeling LLC",
    description: "Siding installation, replacement, and repair from a family-owned Roy, WA contractor. Protect your home from Northwest weather across Thurston, Pierce, King, and Snohomish County."
  },
  {
    title: "Roofing",
    slug: "roofing",
    short: "Roof repair and replacement help that protects your home from leaks and Northwest weather.",
    hero: "Roofing Help for Homes That Need Repair, Replacement, or an Honest Review",
    intro: "Your roof takes the worst of Washington weather, and small problems become expensive ones when they wait. VMG helps homeowners across Pierce, Thurston, King, and Snohomish County address roofing concerns with practical repair and replacement service — and straight answers about what the roof actually needs.",
    benefits: [
      "Protection from leaks, rot, and water damage",
      "A clear, honest assessment of visible roofing concerns",
      "Coordination with gutters, siding, and other exterior work",
      "Long-term protection for the structure underneath"
    ],
    included: [
      "Roof repair review and repairs",
      "Roof replacement planning and installation",
      "Leak and wear assessment",
      "Gutter and roofline coordination",
      "Roofing coordinated with siding or exterior painting"
    ],
    process: [
      { step: "Review the roof and your concerns", detail: "We assess visible wear, leaks, and problem areas." },
      { step: "Explain your options", detail: "Repair versus replacement, materials, and realistic costs." },
      { step: "Schedule around the weather", detail: "Materials and timing planned for dry working windows." },
      { step: "Complete and inspect", detail: "The work is finished and the whole exterior is reviewed." }
    ],
    why: [
      "Practical construction experience, not just a sales pitch",
      "A whole-exterior perspective — roof, gutters, siding, trim",
      "Straightforward estimates with no pressure",
      "Washington-registered contractor based in Roy, WA"
    ],
    faqs: [
      {
        question: "How do I know if my roof needs repair or full replacement?",
        answer: "Age, the extent of wear, and whether moisture has reached the decking all matter. Isolated damage can often be repaired; widespread wear or repeated leaks usually point to replacement. We review the roof and explain what we see."
      },
      {
        question: "Do you help with leaks and storm damage?",
        answer: "Yes. If you have an active leak or storm damage, contact us and we will help you assess the damage and plan the repair."
      },
      {
        question: "Can roofing be combined with other exterior work?",
        answer: "Absolutely. Many customers coordinate roofing with gutters, siding, or exterior painting so the whole exterior is protected and finished together."
      }
    ],
    image: images.roofing[0],
    gallery: images.roofing,
    seoTitle: "Roofing Contractor in Roy, WA | Roof Repair & Replacement | VMG",
    description: "Roof repair and replacement from a family-owned Roy, WA roofing contractor. Honest assessments and quality work across Thurston, Pierce, King, and Snohomish County."
  },
  {
    title: "Windows Installation",
    slug: "windows-installation",
    short: "Professionally installed windows that improve comfort, efficiency, and the look of your home.",
    hero: "New Windows Improve Comfort, Efficiency, and the Look of Your Home",
    intro: "Drafty, foggy, or hard-to-open windows cost you comfort and energy every month. VMG installs replacement and new windows for homeowners across Western Washington, with the interior and exterior finish work handled by the same crew — so the trim, siding, and paint around every window look right when we leave.",
    benefits: [
      "Better comfort and lower drafts through the wet season",
      "Improved energy efficiency and natural light",
      "Clean trim and finish details inside and out",
      "Exterior coordination with siding and paint in one project"
    ],
    included: [
      "Window replacement",
      "New window installation",
      "Sliding glass door installation",
      "Exterior trim coordination",
      "Interior and exterior finish work around every window"
    ],
    process: [
      { step: "Review your windows and goals", detail: "Condition, style, comfort, and efficiency priorities." },
      { step: "Plan fit and finish", detail: "Sizing, trim details, and how the surroundings will be finished." },
      { step: "Install with precision", detail: "Careful alignment, sealing, and protection of your home." },
      { step: "Finish the surfaces", detail: "Trim, caulk, and paint details completed cleanly." }
    ],
    why: [
      "Finish-work standards from a painting and remodeling contractor",
      "Interior and exterior coordination by one team",
      "Clear communication on schedule and scope",
      "Experience with whole-home improvement projects"
    ],
    faqs: [
      {
        question: "Do you install sliding glass doors as well as windows?",
        answer: "Yes. We install and replace windows and sliding glass doors, including the trim and finish work around each opening."
      },
      {
        question: "Will you fix the trim and paint around the new windows?",
        answer: "Yes — that is one of the biggest advantages of hiring VMG. Because we are also a painting and remodeling contractor, the trim, caulking, and paint around your new windows are finished properly as part of the project."
      },
      {
        question: "Can new windows really lower my energy costs?",
        answer: "Modern double-pane windows seal and insulate far better than older single-pane or failed units, which reduces drafts and heat loss. Many homeowners notice the comfort difference right away."
      }
    ],
    image: images.windows[0],
    gallery: images.windows,
    seoTitle: "Window Installation in Roy, WA | Replacement Windows | VMG",
    description: "Professional window and sliding glass door installation from a family-owned Roy, WA contractor. Clean finish work across Thurston, Pierce, King, and Snohomish County."
  },
  {
    title: "Decks",
    slug: "decks",
    short: "Wood decks, composite decks, and custom outdoor living spaces built for everyday family use.",
    hero: "A Deck Built for the Way Your Family Actually Uses the Backyard",
    intro: "A well-built deck adds usable living space to your home for most of the year. As a deck builder serving Pierce, Thurston, King, and Snohomish County, VMG builds and upgrades wood decks, composite decks, and fully custom decks — with the structure, stairs, and railings done right underneath the good looks.",
    benefits: [
      "More usable outdoor living space for your family",
      "Wood or composite decking matched to your maintenance goals",
      "Safe, solid stairs, railings, and framing",
      "Custom layouts designed around how you use the yard"
    ],
    included: [
      "Wood deck construction",
      "Composite deck construction",
      "Custom deck design and builds",
      "Deck replacement and rebuilds",
      "Deck stairs and railings",
      "Deck repairs, staining, and improvements"
    ],
    process: [
      { step: "Talk through the space", detail: "How you want to use it — dining, grilling, relaxing, entertaining." },
      { step: "Plan the build", detail: "Structure, layout, materials, stairs, and railing options." },
      { step: "Build it solid", detail: "Proper footings, framing, and fastening — not just pretty boards." },
      { step: "Walk the finished deck", detail: "We review every detail with you before we call it done." }
    ],
    why: [
      "Custom deck and exterior construction experience",
      "Honest guidance on wood versus composite",
      "Careful structural work under every surface",
      "Family-owned, local Washington deck builder"
    ],
    faqs: [
      {
        question: "Should I choose wood or composite decking?",
        answer: "Wood costs less up front and can be stained any color, but needs regular maintenance. Composite costs more initially but resists fading, rot, and splintering with minimal upkeep. We walk you through both based on your budget and how much maintenance you want to do."
      },
      {
        question: "Can you replace an old or unsafe deck?",
        answer: "Yes. We rebuild and replace aging decks, including new footings, framing, stairs, and railings where the existing structure is no longer sound."
      },
      {
        question: "Do you build custom deck designs?",
        answer: "Yes. Multi-level decks, built-in benches, pergolas, and custom layouts are all options. Tell us how you want to use the space and we will design around it."
      }
    ],
    image: images.decks[0],
    gallery: images.decks,
    seoTitle: "Deck Builder in Roy, WA | Wood, Composite & Custom Decks | VMG",
    description: "Wood, composite, and custom decks built by a family-owned Roy, WA contractor. Solid structure and quality finishes across Thurston, Pierce, King, and Snohomish County."
  },
  {
    title: "Remodeling Services",
    slug: "remodeling-services",
    short: "Practical remodeling that updates kitchens, bathrooms, basements, and the spaces you use most.",
    hero: "Remodeling That Makes Your Home Work Better for the Way You Live",
    intro: "The best remodels start with a clear plan, not a demolition crew. VMG helps homeowners across Western Washington plan and complete remodeling projects with 30+ years of practical construction knowledge — whether you're updating one room or coordinating improvements across the whole house.",
    benefits: [
      "Better everyday function in the rooms you use most",
      "Updated finishes, fixtures, and layouts",
      "A realistic scope and budget before work begins",
      "One contractor coordinating interior and exterior work"
    ],
    included: [
      "Kitchen and bathroom updates",
      "Basement, attic, and garage conversions",
      "Laundry room and home office improvements",
      "Interior remodeling projects",
      "Exterior remodeling updates",
      "Coordination with siding, windows, decks, and painting"
    ],
    process: [
      { step: "Review your goals", detail: "What works, what doesn't, and what you want the space to become." },
      { step: "Plan the practical options", detail: "Priorities, materials, and trade-offs explained clearly." },
      { step: "Agree on a clear scope", detail: "You know what is being done before anything is opened up." },
      { step: "Complete the remodel", detail: "Organized work, clean job sites, and steady communication." }
    ],
    why: [
      "30+ years of hands-on construction leadership",
      "Practical planning before any demolition",
      "Detail-focused workmanship in every trade",
      "Family-owned service with direct communication"
    ],
    faqs: [
      {
        question: "What kinds of remodeling projects do you take on?",
        answer: "Kitchens, bathrooms, basements, attics, laundry rooms, home offices, and whole-room updates — plus exterior improvements like siding, windows, and decks that can be coordinated in the same project."
      },
      {
        question: "How does the remodeling process start?",
        answer: "It starts with a free estimate. We review the space, listen to your goals, and put together a clear scope of work so you know exactly what is included before anything begins."
      },
      {
        question: "Can you handle painting and finish work in a remodel?",
        answer: "Yes. Because VMG is a painting and remodeling contractor, the finish work — paint, trim, and details — is part of what we do best, not something subcontracted at the end."
      }
    ],
    image: images.remodeling[0],
    gallery: images.remodeling,
    seoTitle: "Remodeling Contractor in Roy, WA | Kitchens, Baths & More | VMG",
    description: "Kitchen, bathroom, basement, and whole-home remodeling from a family-owned Roy, WA contractor serving Thurston, Pierce, King, and Snohomish County."
  }
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
