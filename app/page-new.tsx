import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronRight, 
  FileText, 
  MessageSquare, 
  PieChart, 
  Vote, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-2.5 shadow-lg">
              <PieChart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              VoicED
            </span>
            <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105">
              Features
            </Link>
            <Link href="#stats" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105">
              Impact
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-muted/50">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Revolutionizing Student Governance
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Your Voice,
                    <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent"> 
                      {" "}Amplified
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                    Transform how students engage with their institutions. Create petitions, participate in surveys, 
                    join discussions, and make your voice heard in a democratic digital space.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-base px-8 py-6">
                      Start Your Journey
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 hover:bg-muted/50 transition-all duration-200 hover:scale-105 text-base px-8 py-6">
                      Explore Features
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">100% Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">Real-time Updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">24/7 Support</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl"></div>
                  <img
                    src="/placeholder.svg?height=500&width=600"
                    alt="Student Governance Platform Dashboard"
                    className="relative rounded-2xl shadow-2xl object-cover border border-border/50"
                    width={600}
                    height={500}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="w-full py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">2.5K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">450+</div>
                <div className="text-sm text-muted-foreground">Petitions Created</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">89%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                Powerful Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything You Need to Make Change
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl leading-relaxed">
                Our comprehensive platform provides all the tools needed for effective student governance and meaningful participation.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Digital Petitions
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Create compelling petitions and gather support from your community
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Easy petition creation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Real-time signature tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Progress notifications
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/petitions" className="text-sm text-primary flex items-center font-medium hover:text-primary/80 transition-colors">
                    Start a petition <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Smart Surveys</CardTitle>
                    <CardDescription className="text-base">
                      Collect valuable insights and data-driven feedback
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Multiple question types
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Real-time analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Export results
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/surveys" className="text-sm text-primary flex items-center font-medium hover:text-primary/80 transition-colors">
                    Create survey <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Discussion Forums</CardTitle>
                    <CardDescription className="text-base">
                      Engage in moderated discussions and debates
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Topic-based discussions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Moderated content
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Community voting
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/forums" className="text-sm text-primary flex items-center font-medium hover:text-primary/80 transition-colors">
                    Join discussions <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300">
                    <Vote className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Secure Voting
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 hover:bg-red-100">
                        <Shield className="h-3 w-3 mr-1" />
                        Secure
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Transparent and tamper-proof election system
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Encrypted voting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Anonymous ballots
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Live results
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/voting" className="text-sm text-primary flex items-center font-medium hover:text-primary/80 transition-colors">
                    View elections <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Quick Complaints</CardTitle>
                    <CardDescription className="text-base">
                      Fast-track issues directly to administration
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Priority routing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Status tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Resolution updates
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/complaints" className="text-sm text-primary flex items-center font-medium hover:text-primary/80 transition-colors">
                    Report issue <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Live Analytics</CardTitle>
                    <CardDescription className="text-base">
                      Real-time insights and transparency reports
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Engagement metrics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Success tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Impact reports
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/analytics" className="text-sm text-primary flex items-center font-medium hover:text-primary/80 transition-colors">
                    View analytics <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Ready to Make Your Voice Heard?
                </h2>
                <p className="text-muted-foreground md:text-xl leading-relaxed">
                  Join thousands of students who are already creating positive change in their institutions. 
                  Start your journey today and be part of the democratic revolution.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-base px-8 py-6">
                    Get Started Free
                    <Users className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 hover:bg-muted/50 transition-all duration-200 hover:scale-105 text-base px-8 py-6">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-2 shadow-lg">
                  <PieChart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">VoicED</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering students to create meaningful change through digital democracy and transparent governance.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard/petitions" className="hover:text-foreground transition-colors">Petitions</Link></li>
                <li><Link href="/dashboard/surveys" className="hover:text-foreground transition-colors">Surveys</Link></li>
                <li><Link href="/dashboard/forums" className="hover:text-foreground transition-colors">Forums</Link></li>
                <li><Link href="/dashboard/voting" className="hover:text-foreground transition-colors">Voting</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 VoicED. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
