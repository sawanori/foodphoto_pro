// Static generation configuration for foodphoto page
export async function generateStaticParams() {
  // Generate static pages for main foodphoto page
  return [{}];
}

// Enable static generation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour