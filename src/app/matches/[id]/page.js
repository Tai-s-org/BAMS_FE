"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { format, set } from "date-fns"
import { Calendar, Clock, MapPin, Edit, ArrowLeft, Plus, Trash2, FileText, Users, Info } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/Alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import ArticleForm from "@/components/matches/ArticleForm"
import PlayerSelector from "@/components/matches/PlayerSelector"
import matchApi from "@/api/match"
import { useAuth } from "@/hooks/context/AuthContext"

export default function MatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const {userInfo} = useAuth();
  const [match, setMatch] = useState(null)
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [showPlayerSelector, setShowPlayerSelector] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState("home")
  const [availablePlayers, setAvailablePlayers] = useState([])

  useEffect(() => {
    fetchMatchDetails();
    fetchListPlayers();
  }, [params.id])

  const fetchMatchDetails = async () => {
    try {
      const response = await matchApi.getMatchById(params.id);
      console.log("Match details:", response?.data.data);
      setMatch(response?.data.data)
    } catch (error) {
      console.error("Error fetching match details:", error)
    }
  }

  const fetchListPlayers = async () => {
    try {
      const response = await matchApi.getAvailablePlayers(params.id);
      console.log("Players:", response?.data.data);
      setAvailablePlayers(response?.data.data);
    } catch (error) {
      console.error("Error fetching players:", error)
    }
  }

  const handleDeleteArticle = (articleId) => {
    setMatch({
      ...match,
      matchArticles: match.matchArticles.filter((article) => article.id !== articleId),
    })
  }

  const handleSaveArticle = (article) => {
    if (editingArticle) {
      // Update existing article
      setMatch({
        ...match,
        matchArticles: match.matchArticles.map((a) =>
          a.id === editingArticle.id ? { ...article, id: editingArticle.id } : a
        ),
      })
    } else {
      // Add new article
      setMatch({
        ...match,
        matchArticles: [...match.matchArticles, { ...article, id: Date.now() }],
      })
    }
    setShowArticleForm(false)
    setEditingArticle(null)
  }

  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setShowArticleForm(true)
  }

  const handleAddPlayers = (players, team) => {
    if (team === "home") {
      setMatch({
        ...match,
        homeTeamPlayers: [...match.homeTeamPlayers, ...players],
      })
    } else {
      setMatch({
        ...match,
        awayTeamPlayers: [...match.awayTeamPlayers, ...players],
      })
    }
    setShowPlayerSelector(false)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/matches")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-[#BD2427]">{match?.matchName}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge
              variant={match?.status === "Sắp diễn ra" ? "outline" : "default"}
              className="bg-[#BD2427] text-white mb-2"
            >
              {match?.status}
            </Badge>
            <h2 className="text-2xl font-bold">{match?.matchName}</h2>
          </div>
          <Link href={`/matches/${match?.matchId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Sửa trận đấu
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="mr-3 h-5 w-5 text-[#BD2427]" />
              <div>
                <div className="text-sm text-gray-500">Ngày</div>
                <div>{match && format(new Date(match?.scheduledDate), "dd/MM/yyyy")}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="mr-3 h-5 w-5 text-[#BD2427]" />
              <div>
                <div className="text-sm text-gray-500">Thời gian</div>
                <div>
                  {match?.scheduledStartTime} - {match?.scheduledEndTime}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-[#BD2427]" />
              <div>
                <div className="text-sm text-gray-500">Địa điểm</div>
                <div>{match?.courtName}</div>
                <div className="text-sm text-gray-500">{match?.courtAddress}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
            <div className="text-center w-full">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold">{match?.homeTeamName || "Chưa xác định"}</div>
                <div className="text-lg font-bold">{match?.awayTeamName || "Chưa xác định"}</div>
              </div>
              <div className="flex justify-center items-center text-4xl font-bold my-4">
                <span>{match?.scoreHome}</span>
                <span className="mx-4">-</span>
                <span>{match?.scoreAway}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details" className="flex items-center">
            <Info className="mr-2 h-4 w-4" />
            Chi tiết
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Tư liệu
          </TabsTrigger>
          <TabsTrigger value="players" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Cầu thủ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết trận đấu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Đội nhà</h3>
                  <p>{match?.homeTeamName || "Chưa được chỉ định"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Đội khách</h3>
                  <p>{match?.awayTeamName || "Chưa được chỉ định"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button
              className="bg-[#BD2427] hover:bg-[#9a1e21]"
              onClick={() => {
                setEditingArticle(null)
                setShowArticleForm(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm tư liệu
            </Button>
          </div>

          {showArticleForm && (
            <ArticleForm
              article={editingArticle}
              onSave={handleSaveArticle}
              onCancel={() => {
                setShowArticleForm(false)
                setEditingArticle(null)
              }}
              matchId={params.id}
            />
          )}

          {match?.matchArticles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Chưa có tư liệu</h3>
              <p className="mt-2 text-gray-500">Tạo tư liệu đầu tiên của bạn</p>
            </div>
          ) : (
            <div className="space-y-4">
              {match?.matchArticles.map((article) => (
                <Card key={article.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{article.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditArticle(article)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                              <AlertDialogDescription>Điều này sẽ xóa vĩnh viễn tư liệu này.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-[#BD2427] hover:bg-[#9a1e21]"
                                onClick={() => handleDeleteArticle(article.id)}
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{article.content}</p>

                    {article.uploadType === "url" && article.url && (
                      <div className="mt-4 p-3 border rounded-md flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-[#BD2427]" />
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#BD2427] hover:underline"
                        >
                          Xem liên kết
                        </a>
                      </div>
                    )}

                    {article.uploadType === "file" && article.fileUrl && (
                      <div className="mt-4 p-3 border rounded-md flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-[#BD2427]" />
                        <a
                          href={article.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#BD2427] hover:underline"
                        >
                          Tài liệu đính kèm
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="players" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Home Team Players */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Cầu thủ đội nhà</CardTitle>
                  {match && match?.homeTeamId && match?.homeTeamId === userInfo?.roleInformation.teamId && userInfo.roleCode === "Coach" && <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTeam("home")
                      setShowPlayerSelector(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm cầu thủ
                  </Button>}
                </div>
              </CardHeader>
              <CardContent>
                {match?.homeTeamPlayers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Chưa có cầu thủ nào</div>
                ) : (
                  <div className="space-y-2">
                    {match?.homeTeamPlayers.map((player, index) => (
                      <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={player.avatarUrl || "/placeholder.svg"} />
                          <AvatarFallback>{player.playerName}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{player.playerName}</div>
                          <div className="text-sm text-gray-500">#{player.shirtNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Away Team Players */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Cầu thủ đội khách</CardTitle>
                  {match && match?.awayTeamId && match?.awayTeamId === userInfo?.roleInformation.teamId && userInfo.roleCode === "Coach" && <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTeam("away")
                      setShowPlayerSelector(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm cầu thủ
                  </Button>}
                </div>
              </CardHeader>
              <CardContent>
                {match?.awayTeamPlayers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Chưa có cầu thủ nào</div>
                ) : (
                  <div className="space-y-2">
                    {match?.awayTeamPlayers.map((player, index) => (
                      <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={player.avatarUrl || "/placeholder.svg"} />
                          <AvatarFallback>{player.playerName}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{player.playerName}</div>
                          <div className="text-sm text-gray-500">#{player.shirtNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {showPlayerSelector && (
            <PlayerSelector
              team={selectedTeam}
              onSave={handleAddPlayers}
              onCancel={() => setShowPlayerSelector(false)}
              availablePlayers={availablePlayers}
              matchId={params.id}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}