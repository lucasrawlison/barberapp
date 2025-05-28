"use client"

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CalendarNavigationProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function CalendarNavigation({ selectedDate, onDateChange }: CalendarNavigationProps) {
  const today = new Date()

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate)
    previousDay.setDate(selectedDate.getDate() - 1)
    onDateChange(previousDay)
  }

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(selectedDate.getDate() + 1)
    onDateChange(nextDay)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  const isToday = selectedDate.toDateString() === today.toDateString()

  // Generate week view
  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDays.push(date)
    }
    return weekDays
  }

  const weekDays = getWeekDays()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="gap-2 sm:gap-0 flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span className="text-xs sm:text-lg">
                {selectedDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </h3>
            {!isToday && (
              <Button className="" variant="outline" size="sm" onClick={goToToday}>
                Ir para Hoje
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousDay}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextDay}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Week View */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString()
            const isCurrentDay = date.toDateString() === today.toDateString()

            return (
              <button
                key={index}
                onClick={() => onDateChange(date)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : isCurrentDay
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="text-[9px] sm:text-xs">{date.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
                <div
                  className={`text-xs sm:text-lg font-semibold ${
                    isSelected ? "text-white" : isCurrentDay ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {date.getDate()}
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
