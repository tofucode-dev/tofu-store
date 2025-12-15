import { Product } from "@/lib/types/product"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion"
import { StarRating } from "../shared/StarRating"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { User, ThumbsUp } from "lucide-react"

type ProductTabsProps = {
    product: Product
  }
  
  // Mock reviews data - in production this would come from an API
const mockReviews = [
    {
      id: '1',
      author: 'Sarah M.',
      rating: 5,
      date: '2024-12-01',
      title: 'Excellent product!',
      content: 'Exactly what I was looking for. Great quality and fast shipping. Would definitely recommend to others.',
      helpful: 24,
    },
    {
      id: '2',
      author: 'John D.',
      rating: 4,
      date: '2024-11-28',
      title: 'Good value for money',
      content: 'Works as expected. The build quality is solid and it arrived well-packaged. Minor issue with the instructions but figured it out.',
      helpful: 12,
    },
    {
      id: '3',
      author: 'Emily R.',
      rating: 5,
      date: '2024-11-15',
      title: 'Love it!',
      content: 'This exceeded my expectations. The attention to detail is impressive and it looks even better in person.',
      helpful: 18,
    },
  ]

  const faqs = [
    {
      question: 'What is the return policy?',
      answer: 'We offer a 30-day hassle-free return policy. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund.',
    },
    {
      question: 'Is this product covered by warranty?',
      answer: 'Yes, this product comes with a 2-year manufacturer warranty that covers defects in materials and workmanship.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for faster delivery.',
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, once your order ships, you\'ll receive an email with tracking information so you can follow your package every step of the way.',
    },
  ]
  
  export const ProductTabs = ({ product }: ProductTabsProps) => {
    // Generate mock specifications based on product data
    const specifications = [
      { label: 'Brand', value: product.brand || 'N/A' },
      { label: 'Category', value: product.categories?.[0] || 'N/A' },
      { label: 'SKU', value: product.objectID },
      { label: 'Availability', value: 'In Stock' },
      { label: 'Rating', value: product.rating ? `${product.rating}/5` : 'N/A' },
    ]
  
    return (
      <section aria-labelledby="product-details-heading">
        <h2 id="product-details-heading" className="sr-only">
          Product details
        </h2>
        
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger 
              value="description"
              className="rounded-full border border-transparent bg-muted px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="specifications"
              className="rounded-full border border-transparent bg-muted px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-full border border-transparent bg-muted px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Reviews ({mockReviews.length})
            </TabsTrigger>
            <TabsTrigger 
              value="faq"
              className="rounded-full border border-transparent bg-muted px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              FAQ
            </TabsTrigger>
          </TabsList>
  
          <TabsContent value="description" className="mt-0">
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">About this product</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {product.description || 
                    `Discover the ${product.name} - a premium product designed to exceed your expectations. 
                    Crafted with attention to detail and built to last, this item combines functionality 
                    with style. Whether you're upgrading your collection or trying something new, 
                    the ${product.name} delivers outstanding performance and value.`}
                </p>
                {product.brand && (
                  <div className="mt-6 rounded-lg bg-muted/50 p-4">
                    <h4 className="mb-2 font-medium">About {product.brand}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.brand} is committed to delivering high-quality products that 
                      combine innovation with reliability. With years of experience in the industry, 
                      they continue to set the standard for excellence.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
  
          <TabsContent value="specifications" className="mt-0">
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Technical Specifications</h3>
              <dl className="divide-y divide-border">
                {specifications.map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 text-sm">
                    <dt className="font-medium text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TabsContent>
  
          <TabsContent value="reviews" className="mt-0">
            <div className="space-y-6">
              {/* Reviews Summary */}
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Customer Reviews</h3>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="text-center">
                    <div className="text-5xl font-bold">
                      {product.rating?.toFixed(1) || '4.5'}
                    </div>
                    <div className="mt-1">
                      <StarRating rating={Math.round(product.rating || 4.5)} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Based on {mockReviews.length} reviews
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Individual Reviews */}
              <div className="space-y-4">
                {mockReviews.map(review => (
                  <article 
                    key={review.id} 
                    className="rounded-xl bg-card p-6 shadow-sm"
                    aria-labelledby={`review-${review.id}-title`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            <User className="h-4 w-4" aria-hidden="true" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.author}</p>
                          <time 
                            dateTime={review.date} 
                            className="text-sm text-muted-foreground"
                          >
                            {new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <h4 
                      id={`review-${review.id}-title`} 
                      className="mt-4 font-semibold"
                    >
                      {review.title}
                    </h4>
                    <p className="mt-2 text-muted-foreground">{review.content}</p>
                    <button 
                      className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      aria-label={`${review.helpful} people found this helpful. Mark as helpful.`}
                    >
                      <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                      Helpful ({review.helpful})
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </TabsContent>
  
          <TabsContent value="faq" className="mt-0">
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    )
  }
  
  