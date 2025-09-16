import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from './ui/animated-button';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from './ui/animated-card';
import { AnimatedBadge } from './ui/animated-badge';
import { CounterAnimation } from './ui/counter-animation';
import { ArrowRight, Waves, TreePine, Shield, Users, Globe, TrendingUp, CheckCircle, Leaf, Star, Award } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 ">
          <div className="text-center">
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-6 shadow-2xl rounded-2xl">
                <Waves className="h-12 w-12 text-white " />
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                className="text-gray-800 text-4xl font-bold"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Samudra
              </motion.span>{" "}
              <span className="text-gray-800 text-4xl font-bold">Ledger</span>
            </motion.h1>


            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              India's First Transparent Blue Carbon Registry
            </motion.p>

            <motion.p
              className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Protecting coastal ecosystems while generating verified carbon credits through
              blockchain-powered transparency and AI-driven monitoring
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <AnimatedButton
                size="lg"
                onClick={onGetStarted}
                className="text-lg px-8 py-4 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>


              <AnimatedButton variant="secondary" size="lg" className="text-lg px-8 py-4">
                Learn More
              </AnimatedButton>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <AnimatedBadge variant="info" className="px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                Avalanche Blockchain
              </AnimatedBadge>
              <AnimatedBadge variant="success" className="px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                NCCR Verified
              </AnimatedBadge>
              <AnimatedBadge variant="default" className="px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                AI-Powered MRV
              </AnimatedBadge>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-40"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 bg-green-200 rounded-full opacity-40"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-100 rounded-full opacity-20"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6 pt-6">Blue Carbon Impact</h2>
            <p className="text-xl text-gray-600 pb-6">Making a measurable difference for India's coastal ecosystems</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 pb-4">
            {[
              { icon: Award, value: 10000, suffix: "+", label: "Carbon Credits Issued", color: "blue" as const, delay: 0 },
              { icon: TreePine, value: 25, suffix: "", label: "Active Projects", color: "green" as const, delay: 0.1 },
              { icon: Waves, value: 50000, suffix: "", label: "Hectares Protected", color: "teal" as const, delay: 0.2 },
              { icon: Users, value: 500, suffix: "+", label: "Community Members", color: "purple" as const, delay: 0.3 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: stat.delay }}
              >
                <motion.div
                  className={`bg-gradient-to-br ${stat.color === 'blue' ? 'from-blue-100 to-blue-200' :
                    stat.color === 'green' ? 'from-green-100 to-green-200' :
                      stat.color === 'teal' ? 'from-teal-100 to-teal-200' :
                        'from-purple-100 to-purple-200'
                    } rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className={`h-10 w-10 ${stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'teal' ? 'text-teal-600' :
                        'text-purple-600'
                    }`} />
                </motion.div>
                <div className={`text-4xl font-bold mb-3 ${stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'teal' ? 'text-teal-600' :
                      'text-purple-600'
                  }`}>
                  <CounterAnimation end={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 pt-2 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 pb-6">A transparent and verifiable blue carbon ecosystem</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TreePine,
                title: "Project Registration",
                description: "Coastal communities and project developers register blue carbon restoration projects",
                features: ["Mangrove restoration", "Seagrass conservation", "Salt marsh protection"],
                color: "blue",
                delay: 0
              },
              {
                icon: Shield,
                title: "AI-Powered Verification",
                description: "Machine learning models analyze satellite data and community reports for accurate MRV",
                features: ["Satellite imagery analysis", "Community field reports", "NCCR validation"],
                color: "green",
                delay: 0.2
              },
              {
                icon: TrendingUp,
                title: "Credit Trading & Retirement",
                description: "Transparent marketplace for purchasing and retiring verified carbon credits",
                features: ["Blockchain transparency", "Immutable certificates", "Real-time tracking"],
                color: "purple",
                delay: 0.4
              }
            ].map((feature, index) => (
              <AnimatedCard key={index} delay={feature.delay}>
                <AnimatedCardHeader>
                  <motion.div
                    className={`bg-gradient-to-br ${feature.color === 'blue' ? 'from-blue-100 to-blue-200' :
                      feature.color === 'green' ? 'from-green-100 to-green-200' :
                        'from-purple-100 to-purple-200'
                      } rounded-2xl w-16 h-16 flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color === 'blue' ? 'text-blue-600' :
                      feature.color === 'green' ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                  </motion.div>
                  <AnimatedCardTitle>{feature.title}</AnimatedCardTitle>
                  <AnimatedCardDescription>
                    {feature.description}
                  </AnimatedCardDescription>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <ul className="space-y-3 text-sm text-gray-600">
                    {feature.features.map((item, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: feature.delay + (idx * 0.1) }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </AnimatedCardContent>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* User Roles Section */}
      <motion.section
        className="py-20 bg-white pb-6 pt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 pt-2 mb-6">Join Our Ecosystem</h2>
            <p className="text-xl text-gray-600 pb-6">Multiple pathways to participate in the blue carbon economy</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: "Project Manager",
                description: "Register and manage blue carbon restoration projects",
                features: [
                  "Register coastal restoration projects",
                  "Submit MRV data and reports",
                  "Earn carbon credits for verified impact",
                  "Work with local communities"
                ],
                buttonText: "Become a Project Manager",
                status: "Open",
                color: "green",
                delay: 0
              },
              {
                icon: TrendingUp,
                title: "Buyer",
                description: "Purchase and retire verified carbon credits",
                features: [
                  "Browse verified carbon credits",
                  "Purchase high-quality credits",
                  "Retire credits for offset goals",
                  "Get immutable certificates"
                ],
                buttonText: "Start Buying Credits",
                status: "Open",
                color: "blue",
                delay: 0.2
              },
              {
                icon: Shield,
                title: "NCCR Verifier",
                description: "Verify MRV reports and approve credit issuance",
                features: [
                  "Review ML-processed MRV data",
                  "Validate carbon sequestration claims",
                  "Approve credit minting",
                  "Maintain registry integrity"
                ],
                buttonText: "By Invitation Only",
                status: "Restricted",
                color: "orange",
                delay: 0.4
              }
            ].map((role, index) => (
              <AnimatedCard
                key={index}
                delay={role.delay}
                className={`border-2 ${role.color === 'green' ? 'border-green-200 hover:border-green-300' :
                  role.color === 'blue' ? 'border-blue-200 hover:border-blue-300' :
                    'border-orange-200 hover:border-orange-300'
                  } ${role.status === 'Restricted' ? 'opacity-90' : ''}`}
              >
                <AnimatedCardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <role.icon className={`h-10 w-10 ${role.color === 'green' ? 'text-green-600' :
                        role.color === 'blue' ? 'text-blue-600' :
                          'text-orange-600'
                        }`} />
                    </motion.div>
                    <AnimatedBadge
                      variant={role.status === 'Open' ? 'success' : 'warning'}
                    >
                      {role.status}
                    </AnimatedBadge>
                  </div>
                  <AnimatedCardTitle className={
                    role.color === 'green' ? 'text-green-700' :
                      role.color === 'blue' ? 'text-blue-700' :
                        'text-orange-700'
                  }>
                    {role.title}
                  </AnimatedCardTitle>
                  <AnimatedCardDescription>
                    {role.description}
                  </AnimatedCardDescription>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <ul className="space-y-3 text-sm text-gray-600 mb-8">
                    {role.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: role.delay + (idx * 0.1) }}
                      >
                        • {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <AnimatedButton
                    variant={role.status === 'Restricted' ? 'outline' : 'primary'}
                    className="w-full transition duration-300"
                    style={{
                      background: role.color === 'green' ? 'linear-gradient(to right, #10b981, #059669)' :
                        role.color === 'blue' ? 'linear-gradient(to right, #3b82f6, #2563eb)' :
                          role.color === 'orange' ? 'linear-gradient(to right, #f97316, #ea580c)' :
                            undefined,
                      color: 'white', // text visible on all buttons
                    }}
                    onClick={role.status === 'Restricted' ? undefined : onGetStarted}
                    disabled={role.status === 'Restricted'}
                  >
                    {role.buttonText}
                  </AnimatedButton>
                </AnimatedCardContent>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-4 bg-gradient-to-r from-blue-600 to-green-600 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-green-600/90"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(37, 99, 235, 0.9), rgba(34, 197, 94, 0.9))",
              "linear-gradient(45deg, rgba(34, 197, 94, 0.9), rgba(37, 99, 235, 0.9))",
              "linear-gradient(45deg, rgba(37, 99, 235, 0.9), rgba(34, 197, 94, 0.9))"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 p-6">
              Ready to Build India's Blue Carbon Future?
            </h2>
            <p className="text-xl mb-10 opacity-95 leading-relaxed mb-8">
              Join thousands of coastal communities, project developers, and corporate buyers
              creating a transparent and sustainable blue carbon economy.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatedButton
                size="lg"
                variant="secondary"
                onClick={onGetStarted}
                className="text-lg px-10 py-4 bg-white text-blue-600 hover:bg-blue-50 px-2"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
              <AnimatedButton
                size="lg"
                variant="outline"
                className="text-lg px-10 py-4 text-white border-white hover:bg-white hover:text-blue-600 px-2"
              >
                View Public Registry
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full"
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Waves className="h-6 w-6" />
                <span className="font-bold text-lg">Samudra Ledger</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                India's transparent blue carbon registry powered by blockchain technology and AI-driven verification.
              </p>
            </motion.div>

            {[
              {
                title: "Platform",
                items: ["Register Projects", "Submit MRV Data", "Buy Credits", "Retire Credits"]
              },
              {
                title: "Technology",
                items: ["Avalanche Blockchain", "IPFS Storage", "AI/ML Verification", "Smart Contracts"]
              },
              {
                title: "Resources",
                items: ["Documentation", "API Reference", "Support", "Community"]
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              >
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  {section.items.map((item, idx) => (
                    <motion.li
                      key={item}
                      whileHover={{ x: 5, color: "#ffffff" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p>© 2025 Samudra Ledger. All rights reserved. Powered by Avalanche & Supabase.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}