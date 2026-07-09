import { images } from "./images";

export type Service = {
  title: string;
  slug: string;
  short: string;
  hero: string;
  intro: string;
  benefits: string[];
  included: string[];
  process: string[];
  why: string[];
  image: string;
  gallery: string[];
  seoTitle: string;
  description: string;
};

export const services: Service[] = [
  {
    title: "Interior & Exterior Painting",
    slug: "interior-exterior-painting",
    short: "Clean lines, durable finishes, and professional prep work for homes, rentals, and commercial spaces.",
    hero: "Clean Painting Work Built on Preparation, Materials, and Detail",
    intro: "A quality paint job starts before the first coat. VMG handles interior and exterior painting with careful surface preparation, clean lines, proper materials, and a contractor's eye for the whole home.",
    benefits: ["Fresh curb appeal and cleaner interiors", "Durable finishes selected for the surface", "Improved protection against Washington weather", "A more polished look for homes and properties"],
    included: ["Interior wall painting", "Exterior house painting", "Trim, doors, and baseboards", "Cabinet and accent wall painting", "Deck and fence staining", "Surface preparation and finish coordination"],
    process: ["Review the surfaces and project goals", "Prepare walls, trim, siding, or exterior materials", "Protect surrounding areas and apply the right products", "Clean up and complete a final walkthrough"],
    why: ["Over 30 years of construction experience", "Careful prep before finish work", "Interior and exterior project knowledge", "Clear communication from estimate to walkthrough"],
    image: images.painting[0],
    gallery: images.painting,
    seoTitle: "Interior & Exterior Painting in Roy, WA | VMG Painting & Remodeling LLC",
    description: "VMG Painting & Remodeling LLC provides interior and exterior painting services across Thurston, Pierce, King, and Snohomish County."
  },
  {
    title: "Siding",
    slug: "siding",
    short: "Improve curb appeal and protect your home with siding repair, replacement, and installation services.",
    hero: "Protect Your Home and Improve Curb Appeal With Quality Siding Work",
    intro: "Siding helps protect the structure from moisture, wind, and long-term weather exposure. VMG can review worn, cracked, loose, or faded siding and plan the right next step.",
    benefits: ["Better protection from moisture and weather", "Improved curb appeal", "Coordinated exterior trim and paint details", "A cleaner, stronger exterior envelope"],
    included: ["Siding installation", "Siding replacement", "Siding repairs", "Exterior trim coordination", "Weather-exposed area review", "Exterior refresh projects with painting"],
    process: ["Inspect the existing siding condition", "Discuss repair, replacement, and finish options", "Prepare the exterior and install materials carefully", "Review details around trim, windows, and transitions"],
    why: ["Construction-based exterior knowledge", "Painting, window, and trim coordination", "Practical recommendations", "Local Washington service"],
    image: images.siding[0],
    gallery: images.siding,
    seoTitle: "Siding Installation & Replacement in Roy, WA | VMG Painting & Remodeling LLC",
    description: "VMG Painting & Remodeling LLC provides siding services across Thurston, Pierce, King, and Snohomish County."
  },
  {
    title: "Roofing",
    slug: "roofing",
    short: "Roof repair and replacement solutions designed to help protect your home from leaks and weather damage.",
    hero: "Roofing Help for Homes That Need Repair, Replacement, or a Professional Review",
    intro: "Your roof is one of the most important parts of your home. VMG helps homeowners address roofing concerns with practical service for repair, replacement, and exterior coordination.",
    benefits: ["Protection from leaks and water damage", "Clear assessment of visible roofing concerns", "Coordination with siding, gutters, and exterior work", "Better long-term home protection"],
    included: ["Roof repair review", "Roof replacement planning", "Leak and wear assessment", "Roofing coordination with siding or painting", "Gutter and exterior improvement coordination"],
    process: ["Review visible roof concerns and goals", "Explain repair or replacement options", "Coordinate materials and schedule around weather", "Complete the work and review the finished exterior"],
    why: ["Practical construction experience", "Exterior systems perspective", "Straightforward estimates", "Washington-registered contractor"],
    image: images.roofing[0],
    gallery: images.roofing,
    seoTitle: "Roofing Contractor in Roy, WA | Roof Repair & Replacement | VMG",
    description: "VMG Painting & Remodeling LLC provides roofing services for homeowners in Thurston, Pierce, King, and Snohomish County."
  },
  {
    title: "Windows Installation",
    slug: "windows-installation",
    short: "Upgrade comfort, energy efficiency, and appearance with professionally installed windows.",
    hero: "New Windows Can Improve Comfort, Appearance, and Everyday Function",
    intro: "VMG provides window installation services for homeowners who want better comfort, better curb appeal, and a cleaner finished result inside and outside the home.",
    benefits: ["Improved comfort and appearance", "Cleaner trim and finish details", "Better everyday function", "Exterior coordination with siding and paint"],
    included: ["Window replacement", "New window installation", "Sliding glass door coordination", "Exterior trim coordination", "Interior and exterior finish work around windows"],
    process: ["Review window condition and project goals", "Plan fit, finish, and surrounding trim details", "Install with attention to alignment and protection", "Finish surrounding surfaces cleanly"],
    why: ["Detailed finish-work standards", "Exterior and interior coordination", "Clear communication", "Experience with whole-home improvements"],
    image: images.windows[0],
    gallery: images.windows,
    seoTitle: "Window Installation in Roy, WA | VMG Painting & Remodeling LLC",
    description: "Upgrade your home with professional window installation services from VMG Painting & Remodeling LLC."
  },
  {
    title: "Decks",
    slug: "decks",
    short: "Wood decks, composite decks, and custom outdoor living spaces built for everyday use.",
    hero: "Outdoor Living Starts With a Deck Built for the Way You Use Your Home",
    intro: "VMG builds and upgrades wood decks, composite decks, and custom decks for homeowners who want a stronger, better-looking outdoor area.",
    benefits: ["More usable outdoor living space", "Decking options matched to maintenance goals", "Improved safety, stairs, and railings", "Custom layouts for how your family uses the yard"],
    included: ["Wood decks", "Composite decks", "Custom decks", "Deck replacement", "Deck stairs and railings", "Deck repairs and improvements"],
    process: ["Talk through how you want to use the outdoor space", "Review structure, layout, materials, stairs, and railings", "Build with practical construction details", "Walk through the completed deck together"],
    why: ["Custom deck and exterior experience", "Wood and composite options", "Careful structural thinking", "Family-owned local contractor"],
    image: images.decks[0],
    gallery: images.decks,
    seoTitle: "Deck Builder in Roy, WA | Wood, Composite & Custom Decks | VMG",
    description: "VMG Painting & Remodeling LLC builds and upgrades wood decks, composite decks, and custom decks across Western Washington."
  },
  {
    title: "Remodeling Services",
    slug: "remodeling-services",
    short: "Functional, attractive remodeling solutions for homeowners ready to update the spaces they use most.",
    hero: "Remodeling That Makes Your Home Work Better for the Way You Live",
    intro: "VMG helps homeowners plan and complete remodeling projects with practical construction knowledge and careful workmanship, whether updating one area or coordinating several improvements.",
    benefits: ["Better function in everyday spaces", "Updated finishes and layouts", "Practical scope planning", "Coordination across interior and exterior work"],
    included: ["Interior remodeling projects", "Exterior remodeling updates", "Kitchen and bathroom updates", "Basement, attic, laundry, and office improvements", "Siding, windows, decks, and exterior coordination"],
    process: ["Review your goals and current conditions", "Discuss practical options and priorities", "Create a clear scope of work", "Complete the remodel with organized communication"],
    why: ["30+ years of hands-on construction leadership", "Practical planning before demolition", "Detail-focused workmanship", "Family-owned service"],
    image: images.remodeling[0],
    gallery: images.remodeling,
    seoTitle: "Remodeling Contractor in Roy, WA | VMG Painting & Remodeling LLC",
    description: "VMG Painting & Remodeling LLC provides remodeling services for homeowners across Thurston, Pierce, King, and Snohomish County."
  }
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
