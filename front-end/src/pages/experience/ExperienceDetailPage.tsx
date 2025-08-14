// src/pages/experience/ExperienceDetailPage.tsx
import { useParams } from "react-router-dom";
import {
    MapPin, Tag, Calendar, Users, Clock, Star,
    CheckCircle, Compass, Activity, TreePine, PartyPopper, Mail
} from "lucide-react";

type ScheduleItem = { time: string; activity: string };
type NearbyPlace = { name: string; description: string; image?: string; category: string; link: string };

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    activity: Activity,
    nature: TreePine,
    festival: PartyPopper,
};

export default function ExperienceDetailPage() {
    const { id } = useParams(); // /experiences/:id

    const experience = {
        id: id ?? "potato-farm",
        title: "땅속 보물 찾기, 아이와 함께하는 감자 명상 🍠",
        description: `“평창 감자 힐링 팜” – 땅과 마음을 채우는 특별한 하루 🥔✨
강원도 평창의 깨끗한 들판에서 펼쳐지는 프리미엄 감자 수확 체험. 👨‍👩‍👧‍👦
아이들과 함께 흙 속 깊이 숨은 ‘자연의 보물’을 찾아내며,
수확의 설렘과 자연의 고마움을 온몸으로 느껴보세요. 🌿🤲
감자를 캐는 동안 고요한 바람과 흙 내음을 만끽하는 ‘감자 명상’ 시간이 준비되어 있습니다. 🧘‍♀️🌬️
일상의 복잡함을 내려놓고, 오롯이 현재에 머무는 순간을 경험하세요. 😌
수확한 감자는 그대로 가져갈 수 있으며,
현장에서 갓 캔 감자로 만든 따끈한 간식도 맛볼 수 있습니다. 😋
가족, 친구, 연인과 함께하는 평창 감자 힐링 팜에서
평생 기억될 하루를 만들어보세요. ❤️`,
        location: "강원도 평창",
        price: "50,000원",
        hashtags: ["#감자캐기", "#가족여행", "#농촌체험", "#힐링", "#자연교감", "#평창"],
        image: "/placeholder.svg?height=400&width=600",
        host: {
            name: "평창 감자 농장",
            contact: "010-1234-5678",
            email: "potato.farm@example.com",
        },
        duration: "약 3시간",
        availableDates: "매주 주말 (사전 예약 필수)",
        schedule: [
            { time: "10:00", activity: "✅ 농장 도착 및 환영" },
            { time: "10:30", activity: "🛠️ 감자 캐기 도구 설명 및 안전 교육" },
            { time: "11:00", activity: "🥔 본격적인 감자 캐기 체험 (땅속 보물 찾기)" },
            { time: "12:00", activity: "🍽️ 수확한 감자로 만든 간식 시식 및 휴식" },
            { time: "12:30", activity: "🧘‍♀️ 감자 명상 시간 및 자유 시간" },
            { time: "13:00", activity: "👋 체험 마무리 및 기념품 증정" },
        ] as ScheduleItem[],
        highlights: [
            "아이들이 좋아하는 땅속 보물 찾기 컨셉",
            "청정 자연 속에서 즐기는 힐링 명상",
            "갓 캔 유기농 감자로 만든 특별한 간식",
            "직접 수확한 감자 가져가기",
        ],
        inclusions: ["체험 도구 대여", "수확 감자 (1kg)", "감자 간식", "안전 교육"],
        nearbyPlaces: [
            { name: "대관령 양떼목장", description: "푸른 초원에서 양들과 교감하는 목장 체험.", image: "/placeholder.svg?height=150&width=250", category: "activity", link: "#" },
            { name: "월정사 전나무 숲길", description: "천년 고찰 월정사의 고요한 전나무 숲길을 거닐며 힐링.", image: "/placeholder.svg?height=150&width=250", category: "nature", link: "#" },
            { name: "평창 송어축제장", description: "겨울철 얼음낚시와 다양한 즐길 거리가 가득한 축제.", image: "/placeholder.svg?height=150&width=250", category: "festival", link: "#" },
        ] as NearbyPlace[],
    };

    return (
        <>
            <div className="w-full max-w-3xl mx-auto rounded border bg-white shadow-sm">
                <img
                    src={experience.image || "/placeholder.svg"}
                    width={800}
                    height={450}
                    alt={experience.title}
                    className="w-full aspect-video object-cover rounded-t"
                />

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6">{experience.title}</h1>

                    <p className="text-lg whitespace-pre-line mb-8">
                        {experience.description}
                    </p>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                            <MapPin className="h-6 w-6 mb-2" />
                            <span className="font-medium">{experience.location}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                            <Clock className="h-6 w-6 mb-2" />
                            <span className="font-medium">{experience.duration}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                            <Users className="h-6 w-6 mb-2" />
                            <span className="font-medium">{experience.price}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-gray-700">
                            <Calendar className="h-6 w-6 mb-2" />
                            <span className="font-medium">{experience.availableDates}</span>
                        </div>
                    </div>

                    {/* 일정 */}
                    <div className="bg-secondary p-4 rounded-lg shadow-sm mb-8">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
                            <Calendar className="h-6 w-6" />
                            체험 일정
                        </h3>
                        <div className="space-y-3">
                            {experience.schedule.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-md shadow-sm">
                                    <span className="font-semibold w-16 flex-shrink-0">{item.time}</span>
                                    <span>{item.activity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 하이라이트 */}
                    <div className="border-t border-gray-200 pt-6 mb-8">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <Star className="h-6 w-6 text-primary" />
                            체험 하이라이트
                        </h3>
                        <ul className="space-y-2">
                            {experience.highlights.map((h, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 포함 사항 */}
                    <div className="border-t border-gray-200 pt-6 mb-8">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <Tag className="h-6 w-6 text-primary" />
                            포함 사항
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {experience.inclusions.map((inc, idx) => (
                                <span key={idx} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {inc}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* 해시태그 */}
                    <div className="border-t border-gray-200 pt-6 mb-8">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <Tag className="h-6 w-6 text-primary" />
                            해시태그
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {experience.hashtags.map((tag, idx) => (
                                <span key={idx} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* 운영자 */}
                    <div className="border-t border-gray-200 pt-6 mb-8">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            운영자 정보
                        </h3>
                        <p>
                            {experience.host.name}
                            <br />
                            문의: {experience.host.contact}
                            {experience.host.email && (
                                <>
                                    <br />
                                    <span className="inline-flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${experience.host.email}`} className="hover:underline">
                      {experience.host.email}
                    </a>
                  </span>
                                </>
                            )}
                        </p>
                    </div>

                    {/* 같이 가볼만한 곳 */}
                    <div className="border-t border-gray-200 pt-6 mb-8">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <Compass className="h-6 w-6 text-primary" />
                            같이 가볼만한 곳
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {experience.nearbyPlaces.map((place, idx) => {
                                const Icon = categoryIcons[place.category];
                                return (
                                    <div key={idx} className="flex flex-col rounded border bg-white shadow-sm">
                                        <div className="relative">
                                            <img
                                                src={place.image || "/placeholder.svg"}
                                                width={250}
                                                height={150}
                                                alt={place.name}
                                                className="w-full aspect-[3/2] object-cover rounded-t"
                                            />
                                            {Icon && (
                                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground p-1 rounded-full shadow">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <div className="text-base font-semibold">{place.name}</div>
                                            <div className="text-xs text-gray-600 line-clamp-2">{place.description}</div>
                                            <a href={place.link} className="text-sm text-primary hover:underline mt-2 inline-block">
                                                자세히 보기
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 rounded">
                            예약하기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
