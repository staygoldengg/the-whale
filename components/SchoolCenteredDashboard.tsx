'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, TrendingUp, Trophy, Zap, Heart, BookOpen, Clock, LogOut, LogIn } from 'lucide-react';
import { FuturisticButton } from './FuturisticUI';

/**
 * WeatherPlaygroundRater Component
 * 
 * Provides real-time weather assessment for playground suitability
 * with scoring and recommendations for outdoor activities.
 */
export function WeatherPlaygroundRater() {
  const [weather, setWeather] = useState({
    temp: 72,
    humidity: 55,
    windSpeed: 8,
    condition: 'Partly Cloudy',
    playgroundScore: 85,
    recommendation: 'Perfect day for outdoor activities!',
  });

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      const temp = Math.floor(Math.random() * 30) + 60;
      const humidity = Math.floor(Math.random() * 40) + 40;
      const windSpeed = Math.floor(Math.random() * 15) + 2;
      
      let score = 100;
      let recommendation = 'Excellent playground conditions!';

      if (temp < 45 || temp > 90) {
        score -= 20;
        recommendation = 'Extreme temperature - consider limited outdoor time';
      }
      if (humidity > 80) {
        score -= 15;
        recommendation = 'Very humid - ensure children stay hydrated';
      }
      if (windSpeed > 15) {
        score -= 25;
        recommendation = 'Windy conditions - safe play required';
      }
      if (score > 75) {
        recommendation = 'Perfect day for outdoor activities!';
      } else if (score > 50) {
        recommendation = 'Good for playground with supervision';
      } else {
        recommendation = 'Consider indoor activities today';
      }

      setWeather({
        temp,
        humidity,
        windSpeed,
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        playgroundScore: Math.max(20, score),
        recommendation,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 p-6 border border-cyan-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900">Playground Weather Check</h3>
          <p className="text-sm text-slate-600">Real-time conditions for outdoor activities</p>
        </div>
        <Sun className="w-8 h-8 text-yellow-500" />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg bg-white p-3 border border-cyan-200">
          <p className="text-xs font-bold text-slate-600">TEMPERATURE</p>
          <p className="text-2xl font-black text-slate-900">{weather.temp}°F</p>
        </div>
        <div className="rounded-lg bg-white p-3 border border-cyan-200">
          <p className="text-xs font-bold text-slate-600">HUMIDITY</p>
          <p className="text-2xl font-black text-slate-900">{weather.humidity}%</p>
        </div>
        <div className="rounded-lg bg-white p-3 border border-cyan-200">
          <p className="text-xs font-bold text-slate-600">WIND SPEED</p>
          <p className="text-2xl font-black text-slate-900">{weather.windSpeed}mph</p>
        </div>
        <div className="rounded-lg bg-white p-3 border border-cyan-200">
          <p className="text-xs font-bold text-slate-600">CONDITIONS</p>
          <p className="text-sm font-bold text-slate-900">{weather.condition}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <p className="font-bold text-slate-900">Playground Suitability Score</p>
          <p className={`text-3xl font-black ${getScoreColor(weather.playgroundScore)}`}>
            {weather.playgroundScore}%
          </p>
        </div>
        <div className={`w-full rounded-full h-3 ${getScoreBg(weather.playgroundScore)}`}>
          <div
            className={`h-3 rounded-full transition-all ${
              weather.playgroundScore >= 80
                ? 'bg-green-600'
                : weather.playgroundScore >= 60
                ? 'bg-yellow-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${weather.playgroundScore}%` }}
          />
        </div>
      </div>

      <div className={`rounded-lg p-4 ${getScoreBg(weather.playgroundScore)}`}>
        <p className="font-bold text-slate-900">{weather.recommendation}</p>
      </div>
    </div>
  );
}

/**
 * AttendanceGamification Component
 * 
 * Gamifies sign-in/sign-out with points, streaks, and badges
 */
export function AttendanceGamification() {
  const [attendance, setAttendance] = useState({
    signedIn: false,
    streak: 12,
    points: 340,
    badge: 'Perfect Week',
    lastSignIn: '8:30 AM',
  });

  const handleSignIn = () => {
    setAttendance(prev => ({
      ...prev,
      signedIn: true,
      points: prev.points + 10,
      streak: prev.streak + 1,
    }));
  };

  const handleSignOut = () => {
    setAttendance(prev => ({
      ...prev,
      signedIn: false,
      points: prev.points + 5,
    }));
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-xl text-slate-900">Attendance Adventure</h3>
          <p className="text-sm text-slate-600">Earn points for being present & on-time</p>
        </div>
        <Trophy className="w-8 h-8 text-purple-600" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg bg-white p-3 border border-purple-200 text-center">
          <p className="text-xs font-bold text-slate-600">POINTS</p>
          <p className="text-3xl font-black text-purple-600">{attendance.points}</p>
        </div>
        <div className="rounded-lg bg-white p-3 border border-purple-200 text-center">
          <p className="text-xs font-bold text-slate-600">STREAK</p>
          <p className="text-3xl font-black text-orange-600">{attendance.streak}</p>
          <p className="text-xs text-slate-600">days</p>
        </div>
        <div className="rounded-lg bg-white p-3 border border-purple-200 text-center">
          <p className="text-xs font-bold text-slate-600">BADGE</p>
          <p className="text-sm font-bold text-slate-900">{attendance.badge}</p>
        </div>
      </div>

      <div className="space-y-3">
        {!attendance.signedIn ? (
          <FuturisticButton
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={handleSignIn}
          >
            <LogIn className="w-5 h-5" />
            Sign In (+10 Points)
          </FuturisticButton>
        ) : (
          <>
            <div className="rounded-lg bg-green-100 p-3 border border-green-300 text-center">
              <p className="text-sm font-bold text-green-800">✓ Signed In at {attendance.lastSignIn}</p>
            </div>
            <FuturisticButton
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              Sign Out (+5 Points)
            </FuturisticButton>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * NutritionDashboard Component
 * 
 * Shows nutrition data integrated with food schedule
 */
export function NutritionDashboard() {
  const nutritionData = {
    dailyCalories: 1240,
    dailyCaloriesGoal: 1400,
    protein: 35,
    carbs: 185,
    fats: 42,
    meals: [
      { name: 'Breakfast', time: '8:30 AM', items: 'Oatmeal, Berries, Milk', calories: 350 },
      { name: 'Snack', time: '10:30 AM', items: 'Apple, Almonds', calories: 150 },
      { name: 'Lunch', time: '12:00 PM', items: 'Sandwich, Veggies, Fruit', calories: 520 },
      { name: 'Afternoon Snack', time: '3:00 PM', items: 'Yogurt, Granola', calories: 220 },
    ],
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900">Nutrition Tracker</h3>
          <p className="text-sm text-slate-600">Daily nutrition & meal schedule</p>
        </div>
        <Heart className="w-8 h-8 text-red-500" />
      </div>

      {/* Calorie Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-slate-900">Daily Calories</p>
          <p className="text-lg font-black text-slate-900">
            {nutritionData.dailyCalories} / {nutritionData.dailyCaloriesGoal} kcal
          </p>
        </div>
        <div className="w-full rounded-full h-4 bg-slate-200">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
            style={{ width: `${(nutritionData.dailyCalories / nutritionData.dailyCaloriesGoal) * 100}%` }}
          />
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg bg-white p-3 border border-green-200 text-center">
          <p className="text-xs font-bold text-slate-600">PROTEIN</p>
          <p className="text-2xl font-black text-slate-900">{nutritionData.protein}g</p>
        </div>
        <div className="rounded-lg bg-white p-3 border border-green-200 text-center">
          <p className="text-xs font-bold text-slate-600">CARBS</p>
          <p className="text-2xl font-black text-slate-900">{nutritionData.carbs}g</p>
        </div>
        <div className="rounded-lg bg-white p-3 border border-green-200 text-center">
          <p className="text-xs font-bold text-slate-600">FATS</p>
          <p className="text-2xl font-black text-slate-900">{nutritionData.fats}g</p>
        </div>
      </div>

      {/* Meal Schedule */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-600 uppercase">Today's Schedule</p>
        {nutritionData.meals.map((meal, idx) => (
          <div key={idx} className="flex items-start justify-between rounded-lg bg-white p-3 border border-green-200">
            <div>
              <p className="font-bold text-slate-900">{meal.name}</p>
              <p className="text-xs text-slate-600">{meal.items}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-600">{meal.time}</p>
              <p className="text-sm font-bold text-green-600">{meal.calories} cal</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ScheduleTimings Component
 * 
 * Shows pick-up, drop-off, and daily schedule times
 */
export function ScheduleTimings() {
  const schedule = {
    dropOff: { time: '8:00 AM', guardian: 'Mom (Sarah Miller)' },
    pickUp: { time: '3:30 PM', guardian: 'Dad (John Miller)' },
    napTime: { start: '1:00 PM', end: '2:30 PM', duration: '1.5 hrs' },
    outdoorPlay: { time: '10:30 AM - 11:15 AM', location: 'Playground' },
    artTime: { time: '2:45 PM - 3:15 PM', location: 'Art Room' },
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 border border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900">Daily Schedule</h3>
          <p className="text-sm text-slate-600">Today's important times</p>
        </div>
        <Clock className="w-8 h-8 text-amber-600" />
      </div>

      <div className="space-y-3">
        {/* Drop Off */}
        <div className="rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 p-4 border border-blue-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase">Drop Off</p>
              <p className="text-lg font-black text-slate-900">{schedule.dropOff.time}</p>
              <p className="text-sm text-slate-600">{schedule.dropOff.guardian}</p>
            </div>
            <LogIn className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Nap Time */}
        <div className="rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 p-4 border border-purple-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-purple-700 uppercase">Rest Time</p>
              <p className="text-lg font-black text-slate-900">{schedule.napTime.start} - {schedule.napTime.end}</p>
              <p className="text-sm text-slate-600">{schedule.napTime.duration}</p>
            </div>
            <span className="text-2xl">😴</span>
          </div>
        </div>

        {/* Outdoor Play */}
        <div className="rounded-lg bg-gradient-to-r from-green-100 to-green-50 p-4 border border-green-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-green-700 uppercase">Outdoor Play</p>
              <p className="text-lg font-black text-slate-900">{schedule.outdoorPlay.time}</p>
              <p className="text-sm text-slate-600">📍 {schedule.outdoorPlay.location}</p>
            </div>
            <span className="text-2xl">🏃</span>
          </div>
        </div>

        {/* Pick Up */}
        <div className="rounded-lg bg-gradient-to-r from-red-100 to-red-50 p-4 border border-red-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-red-700 uppercase">Pick Up</p>
              <p className="text-lg font-black text-slate-900">{schedule.pickUp.time}</p>
              <p className="text-sm text-slate-600">{schedule.pickUp.guardian}</p>
            </div>
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
