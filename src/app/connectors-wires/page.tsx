"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Cable, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import SmartImage from "@/components/ui/ImageCorrector"

interface Category {
  id: string
  name: string
  description: string
  image?: string
  isActive: boolean
  options?: any[]
}

type ActiveTab = "connectors" | "wires"

export default function ConnectorsWiresPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>("connectors")
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [activeTab])

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    // Clear categories immediately when switching tabs to prevent stale data
    setCategories([])

    try {
      const endpoint = activeTab === "connectors" ? "/api/connectors/categories" : "/api/wires/categories"
      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.success) {
        setCategories(data.categories?.filter((cat: Category) => cat.isActive) || [])
      } else {
        toast.error(`Failed to load ${activeTab} categories`)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error(`Failed to load ${activeTab} categories`)
      setCategories([])
    } finally {
      setLoading(false)
    }
  },[])

  const handleCategoryClick = (categoryId: string) => {
    // Ensure we're using the correct tab context for routing
    const route = `/${activeTab}/${categoryId}`
    console.log(`Navigating to: ${route}`) // Debug log
    router.push(route)
  }

  const handleTabChange = (value: string) => {
    const newTab = value as ActiveTab
    setActiveTab(newTab)
    // Clear categories immediately to prevent confusion
    setCategories([])
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              Professional Electrical Solutions
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Connectors & Wires
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Select a {activeTab === "connectors" ? "connector" : "wire"} category to configure your custom
              specifications and get competitive quotes
            </motion.p>
          </div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="connectors" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Connectors
                </TabsTrigger>
                <TabsTrigger value="wires" className="flex items-center gap-2">
                  <Cable className="w-4 h-4" />
                  Wires
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Categories Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading {activeTab} categories...</span>
            </div>
          ) : (
            <motion.div
              key={activeTab} // Force re-render when tab changes
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={`${activeTab}-${category.id}`} // Unique key per tab
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-orange-300 dark:hover:border-orange-700 transform hover:-translate-y-1"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardContent className="p-6 space-y-4">
                      {category.image ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <SmartImage
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center">
                          {activeTab === "connectors" ? (
                            <Zap className="w-16 h-16 text-orange-500" />
                          ) : (
                            <Cable className="w-16 h-16 text-orange-500" />
                          )}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">
                            {category.name}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {category.description ||
                            `Professional grade ${category.name.toLowerCase()} for various electrical applications.`}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          {/* <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          >
                            {category.options?.length || 0} options
                          </Badge> */}
                          <span className="text-xs text-orange-600 font-medium group-hover:text-orange-700">
                            Configure →
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {categories.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              {activeTab === "connectors" ? (
                <Zap className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              ) : (
                <Cable className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              )}
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                No {activeTab === "connectors" ? "Connector" : "Wire"} Categories Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {activeTab === "connectors" ? "Connector" : "Wire"} categories will appear here once they are configured
                by the administrator.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
