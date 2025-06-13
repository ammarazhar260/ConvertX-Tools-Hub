
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "ConvertX has transformed my workflow. What used to take hours now takes minutes with their AI tools.",
      author: "Sarah J.",
      role: "Marketing Director"
    },
    {
      quote: "The image to text converter is incredibly accurate. It's become an essential tool for our documentation team.",
      author: "Michael T.",
      role: "Technical Writer"
    },
    {
      quote: "I love how simple it is to use these tools. The interface is clean and the results are impressive.",
      author: "Alex K.",
      role: "Content Creator"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Loved by Professionals</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Here's what our users have to say about ConvertX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-muted/30">
              <CardContent className="p-6">
                <blockquote className="text-lg font-normal italic mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
