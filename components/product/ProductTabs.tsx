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
        <h2 id="product-details-heading" className="mb-6 text-2xl font-bold tracking-tight">
          Product details
        </h2>
        
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0" role="tablist" aria-label="Product information tabs">
            <TabsTrigger 
              id="description-tab"
              value="description"
              className="rounded-full border border-transparent bg-muted px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              aria-controls="description-panel"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              id="specifications-tab"
              value="specifications"
              className="rounded-full border border-transparent bg-muted px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              aria-controls="specifications-panel"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              id="reviews-tab"
              value="reviews"
              className="rounded-full border border-transparent bg-muted px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              aria-controls="reviews-panel"
            >
              Reviews ({mockReviews.length})
            </TabsTrigger>
            <TabsTrigger 
              id="faq-tab"
              value="faq"
              className="rounded-full border border-transparent bg-muted px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              aria-controls="faq-panel"
            >
              FAQ
            </TabsTrigger>
          </TabsList>
  
          <TabsContent value="description" id="description-panel" className="mt-0" role="tabpanel" aria-labelledby="description-tab">
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 
                  className="mb-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  tabIndex={0}
                >
                  About this product
                </h3>
                <p 
                  className="leading-relaxed text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  tabIndex={0}
                >
                  {product.description || 
                    `Discover the ${product.name} - a premium product designed to exceed your expectations. 
                    Crafted with attention to detail and built to last, this item combines functionality 
                    with style. Whether you're upgrading your collection or trying something new, 
                    the ${product.name} delivers outstanding performance and value.`}
                </p>
                {product.brand && (
                  <div 
                    className="mt-6 rounded-lg bg-muted/50 p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    tabIndex={0}
                  >
                    <h4 
                      className="mb-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                      tabIndex={0}
                    >
                      About {product.brand}
                    </h4>
                    <p 
                      className="text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                      tabIndex={0}
                    >
                      {product.brand} is committed to delivering high-quality products that 
                      combine innovation with reliability. With years of experience in the industry, 
                      they continue to set the standard for excellence.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" id="specifications-panel" className="mt-0" role="tabpanel" aria-labelledby="specifications-tab">
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 
                className="mb-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                tabIndex={0}
              >
                Technical Specifications
              </h3>
              <dl className="divide-y divide-border" role="list">
                {specifications.map(({ label, value }) => (
                  <div 
                    key={label} 
                    className="flex justify-between py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm" 
                    role="listitem"
                    tabIndex={0}
                    aria-label={`${label}: ${value}`}
                  >
                    <dt className="font-medium text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TabsContent>
  
          <TabsContent value="reviews" id="reviews-panel" className="mt-0" role="tabpanel" aria-labelledby="reviews-tab">
            <div className="space-y-6">
              {/* Reviews Summary */}
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 
                  className="mb-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  tabIndex={0}
                >
                  Customer Reviews
                </h3>
                <div 
                  className="flex flex-col items-center gap-4 sm:flex-row sm:items-start focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm" 
                  role="group" 
                  aria-label="Review summary"
                  tabIndex={0}
                >
                  <div className="text-center">
                    <div 
                      className="text-5xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm" 
                      aria-label={`Average rating: ${product.rating?.toFixed(1) || '4.5'} out of 5`}
                      tabIndex={0}
                    >
                      {product.rating?.toFixed(1) || '4.5'}
                    </div>
                    <div 
                      className="mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm" 
                      role="group" 
                      aria-label={`Rating: ${Math.round(product.rating || 4.5)} out of 5 stars`}
                      tabIndex={0}
                    >
                      <StarRating rating={Math.round(product.rating || 4.5)} />
                    </div>
                    <p 
                      className="mt-1 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm" 
                      aria-label={`Based on ${mockReviews.length} customer reviews`}
                      tabIndex={0}
                    >
                      Based on {mockReviews.length} reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4" role="list" aria-label="Customer reviews">
                {mockReviews.map(review => (
                  <article 
                    key={review.id} 
                    className="rounded-xl bg-card p-6 shadow-sm"
                    aria-labelledby={`review-${review.id}-title`}
                    role="listitem"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar aria-hidden="true">
                          <AvatarFallback>
                            <User className="h-4 w-4" aria-hidden="true" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium" aria-label={`Review by ${review.author}`}>{review.author}</p>
                          <time 
                            dateTime={review.date} 
                            className="text-sm text-muted-foreground"
                            aria-label={`Review date: ${new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}`}
                          >
                            {new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                      </div>
                      <div role="group" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <h4 
                      id={`review-${review.id}-title`} 
                      className="mt-4 font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                      tabIndex={0}
                    >
                      {review.title}
                    </h4>
                    <p 
                      className="mt-2 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                      tabIndex={0}
                    >
                      {review.content}
                    </p>
                    <button 
                      className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                      aria-label={`${review.helpful} people found this review helpful. Click to mark as helpful.`}
                    >
                      <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" id="faq-panel" className="mt-0" role="tabpanel" aria-labelledby="faq-tab">
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 
                className="mb-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                tabIndex={0}
              >
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full" aria-label="Frequently asked questions">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline" aria-controls={`faq-answer-${index}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent id={`faq-answer-${index}`} className="text-muted-foreground">
                      <p 
                        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                        tabIndex={0}
                        aria-label={`Answer: ${faq.answer}`}
                      >
                        {faq.answer}
                      </p>
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
  
  