import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const unitCategories = {
  length: ["meters", "kilometers", "miles", "feet", "inches"],
  weight: ["grams", "kilograms", "pounds", "ounces"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  volume: ["liters", "milliliters", "gallons", "cups"],
  speed: ["km/h", "mph", "m/s"],
  time: ["seconds", "minutes", "hours", "days"],
};

const conversionFunctions = {
  length: (value, from, to) => {
    const conversions = {
      meters: 1,
      kilometers: 0.001,
      miles: 0.000621371,
      feet: 3.28084,
      inches: 39.3701,
    };
    return (value / conversions[from]) * conversions[to];
  },
  weight: (value, from, to) => {
    const conversions = {
      grams: 1,
      kilograms: 0.001,
      pounds: 0.00220462,
      ounces: 0.035274,
    };
    return (value / conversions[from]) * conversions[to];
  },
  temperature: (value, from, to) => {
    if (from === to) return value;
    if (from === "Celsius" && to === "Fahrenheit") return (value * 9/5) + 32;
    if (from === "Fahrenheit" && to === "Celsius") return (value - 32) * 5/9;
    if (from === "Celsius" && to === "Kelvin") return value + 273.15;
    if (from === "Kelvin" && to === "Celsius") return value - 273.15;
    if (from === "Fahrenheit" && to === "Kelvin") return ((value - 32) * 5/9) + 273.15;
    if (from === "Kelvin" && to === "Fahrenheit") return ((value - 273.15) * 9/5) + 32;
  },
  volume: (value, from, to) => {
    const conversions = {
      liters: 1,
      milliliters: 1000,
      gallons: 0.264172,
      cups: 4.22675,
    };
    return (value / conversions[from]) * conversions[to];
  },
  speed: (value, from, to) => {
    const conversions = {
      "km/h": 1,
      "mph": 0.621371,
      "m/s": 0.277778,
    };
    return (value / conversions[from]) * conversions[to];
  },
  time: (value, from, to) => {
    const conversions = {
      seconds: 1,
      minutes: 1/60,
      hours: 1/3600,
      days: 1/86400,
    };
    return (value / conversions[from]) * conversions[to];
  },
};

const UnitConverter = () => {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meters");
  const [toUnit, setToUnit] = useState("kilometers");
  const [value, setValue] = useState(0);
  const [result, setResult] = useState(0);

  useEffect(() => {
    const convert = () => {
      const conversionFunction = conversionFunctions[category];
      if (conversionFunction) {
        setResult(conversionFunction(value, fromUnit, toUnit));
      }
    };
    convert();
  }, [category, fromUnit, toUnit, value]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full">
              <label className="text-sm font-medium block mb-2">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(unitCategories).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full">
              <label className="text-sm font-medium block mb-2">From Unit</label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select from unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitCategories[category].map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium block mb-2">To Unit</label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select to unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitCategories[category].map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full">
              <label className="text-sm font-medium block mb-2">Value</label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                placeholder="Enter value"
              />
            </div>

            <div className="w-full">
              <label className="text-sm font-medium block mb-2">Result</label>
              <Input
                type="text"
                value={result}
                readOnly
                placeholder="Result"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitConverter; 