import type { WeatherContext } from "@/types";

const WEATHER_PRESETS = {
  深圳: { summary: "今天偏闷热，局部可能有阵雨", advice: "出门别忘了带伞，空调房里记得加件薄外套", temperatureRange: "26-31°C" },
  北京: { summary: "早晚温差明显，白天偏干", advice: "早晚添件外套，白天注意补水", temperatureRange: "14-27°C" },
  上海: { summary: "云层偏厚，体感有些潮", advice: "包里放把伞会更稳妥，晚上注意别着凉", temperatureRange: "18-26°C" },
  广州: { summary: "气温偏高，午后可能有雨", advice: "短袖没问题，但最好带伞防突发阵雨", temperatureRange: "25-32°C" },
  杭州: { summary: "今天微凉，风有点明显", advice: "适合加一层薄外套，晚点出门更舒服", temperatureRange: "16-24°C" },
  成都: { summary: "云多一点，体感比较温和", advice: "可以正常出门，晚归的话记得添件衣服", temperatureRange: "17-25°C" },
 } as const;

export function resolveWeatherCity(city?: string): string {
  if (!city) return "深圳";
  const normalized = city.trim();
  return normalized || "深圳";
}

export function getMockWeatherContext(city?: string): WeatherContext {
  const resolvedCity = resolveWeatherCity(city);
  const preset = WEATHER_PRESETS[resolvedCity as keyof typeof WEATHER_PRESETS] || WEATHER_PRESETS.深圳;

  return {
    city: resolvedCity,
    summary: preset.summary,
    advice: preset.advice,
    temperatureRange: preset.temperatureRange,
    fetchedAt: Date.now(),
  };
}

export function buildWeatherSmallTalk(city?: string): string[] {
  const weather = getMockWeatherContext(city);
  return [
    `${weather.city}这两天天气好像是：${weather.summary}。`,
    `${weather.advice}。`,
  ];
}

export function getWeatherCareLine(city?: string): string {
  const weather = getMockWeatherContext(city);
  return `${weather.city} · ${weather.summary} · ${weather.advice}`;
}
