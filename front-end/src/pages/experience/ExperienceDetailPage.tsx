import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    MapPin, Tag, Calendar, Users, Clock, Star,
    CheckCircle, Compass, Activity, TreePine, PartyPopper, Mail
} from "lucide-react";

// API 응답 데이터의 타입을 정의합니다. (highlights, inclusions, hashtags 추가)
type ApiScheduleItem = {
    time: string;
    activity: string;
};

type ApiHost = {
    hostName: string;
    hostPhone: string;
    hostEmail: string;
    farmName: string;
};

type ApiExperience = {
    title: string;
    region: string;
    description: string;
    price: string;
    imageUrl: string;
    startTime: string;
    endTime: string;
    selectedClosedDays: string[];
    scheduleItems: ApiScheduleItem[];
    highlights: string[];
    inclusions: string[];
    hashtags: string[];
    host: ApiHost;
};


// 컴포넌트에서 사용할 데이터 타입을 정의합니다.
type ScheduleItem = { time: string; activity: string };
type NearbyPlace = { name: string; description: string; image?: string; category: string; link: string };

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    activity: Activity,
    nature: TreePine,
    festival: PartyPopper,
};

export default function ExperienceDetailPage() {
    const { id } = useParams<{ id: string }>();

    // 서버 데이터, 로딩 상태, 에러 상태를 관리합니다.
    const [experience, setExperience] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchExperienceData = async () => {
            try {
                setLoading(true);
                // API 서버로 데이터 요청
                const response = await fetch(`http://localhost:8080/api/v1/experience/${id}`);
                if (!response.ok) {
                    throw new Error('체험 정보를 불러오는데 실패했습니다.');
                }
                const data: ApiExperience = await response.json();

                // API 데이터를 컴포넌트 형식에 맞게 변환
                const formattedData = {
                    title: data.title,
                    description: data.description,
                    location: data.region,
                    price: `${parseInt(data.price).toLocaleString()}원`,
                    image: data.imageUrl,
                    host: {
                        name: data.host.farmName,
                        contact: data.host.hostPhone,
                        email: data.host.hostEmail,
                    },
                    duration: `약 ${parseInt(data.endTime) - parseInt(data.startTime)}시간`,
                    availableDates: `${data.selectedClosedDays.join(', ')} 휴무`,
                    schedule: data.scheduleItems,
                    // API에서 직접 받은 데이터 사용
                    highlights: data.highlights,
                    inclusions: data.inclusions,
                    hashtags: data.hashtags,
                    nearbyPlaces: [], // 이 부분은 API에 없으므로 그대로 둡니다.
                };

                setExperience(formattedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExperienceData();
    }, [id]); // id가 바뀔 때마다 다시 데이터를 요청합니다.

    // 로딩 중일 때 표시할 화면
    if (loading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    // 에러 발생 시 표시할 화면
    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">오류: {error}</div>;
    }

    // 데이터가 없을 때 표시할 화면
    if (!experience) {
        return <div className="flex justify-center items-center h-screen">해당 체험을 찾을 수 없습니다.</div>;
    }

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
                            {experience.schedule.map((item: ScheduleItem, idx: number) => (
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
                            {experience.highlights.map((h: string, idx: number) => (
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
                            {experience.inclusions.map((inc: string, idx: number) => (
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
                            {experience.hashtags.map((tag: string, idx: number) => (
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

                    {/* 같이 가볼만한 곳 (API에 데이터가 없으므로 렌더링되지 않음) */}
                    {experience.nearbyPlaces && experience.nearbyPlaces.length > 0 && (
                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <Compass className="h-6 w-6 text-primary" />
                                같이 가볼만한 곳
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {experience.nearbyPlaces.map((place: NearbyPlace, idx: number) => {
                                    const Icon = categoryIcons[place.category];
                                    return (
                                        <div key={idx} className="flex flex-col rounded border bg-white shadow-sm">
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}


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