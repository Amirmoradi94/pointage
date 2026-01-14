"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CS TA, MIT",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content:
      "Pointage saved me 15+ hours every week. I used to spend my entire weekend grading, now I grade an assignment in under an hour. The AI is incredibly accurate!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Math TA, Stanford",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    content:
      "The batch processing is a game-changer. Upload 100 submissions, get coffee, come back to graded papers. The feedback quality is consistently high.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Physics TA, Berkeley",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content:
      "I was skeptical about AI grading at first, but the confidence scores help me know which submissions need extra review. It's like having a smart assistant.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Engineering TA, Caltech",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    content:
      "Custom rubrics work perfectly. The AI adapts to my grading style and provides detailed feedback that students actually appreciate. Worth every penny.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "Biology TA, Harvard",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    content:
      "Pointage handles different file formats seamlessly. PDFs, Word docs, even images - everything just works. The student info extraction is brilliant.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Chemistry TA, Yale",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    content:
      "Best investment I've made as a TA. The time I save goes into actually helping students during office hours instead of drowning in grading.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-dark relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Loved by TAs</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            What TAs Are{" "}
            <span className="text-gradient-purple">Saying</span>
          </h2>
          <p className="text-lg text-gray-400">
            Join hundreds of TAs who've transformed their grading workflow
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="dark-card rounded-2xl p-6 hover:scale-105 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-indigo-500/30" />
              </div>

              {/* Content */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5"
                />
                <div>
                  <p className="font-semibold text-white text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-2">500+</p>
            <p className="text-sm text-gray-400">Active TAs</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-2">50K+</p>
            <p className="text-sm text-gray-400">Submissions Graded</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-2">98%</p>
            <p className="text-sm text-gray-400">Satisfaction Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
