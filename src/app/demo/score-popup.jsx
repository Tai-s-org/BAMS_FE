// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
// import { Button } from "@/components/ui/Button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group"
// import { Label } from "@/components/ui/Label"
// import { Input } from "@/components/ui/Input"
// import tryOutApi from "@/api/tryOutScore"
// import { useToasts } from "@/hooks/providers/ToastProvider"
// import registerApi from "@/api/register"

// export function ScorePopup({ open, onClose, player }) {
//     // State to store all scores
//     const [scores, setScores] = useState([])
//     const [notes, setNotes] = useState({})
//     const [formValues, setFormValues] = useState({
//         // Basketball skills
//         Dribble: "",
//         Passing: "",
//         Shooting: "",
//         Finishing: "",
//         Attitude: "",
//         Leadership: "",
//         Skills: "",
//         ScrimmagePhysicalFitness: "",
//         BasketballIQ: "",
//         // Physical fitness
//         HexagonTest: "",
//         StandingBroadJump: "",
//         StandingVerticalJump: "",
//         RunningVerticalJump: "",
//         AgilityTest: "",
//         Sprint: "",
//         PushUp: "",
//         StandardPlank: "",
//         PlankSide: "",
//     })
//     const { addToast } = useToasts() 

//     // Function to handle score changes
//     const handleScoreChange = (skillCode, score) => {
//         // Update formValues state
//         setFormValues((prev) => ({
//             ...prev,
//             [skillCode]: score,
//         }))

//         // Check if this skill already has a score
//         const existingIndex = scores.findIndex((entry) => entry.skillCode === skillCode)

//         if (existingIndex >= 0) {
//             // Update existing score
//             const updatedScores = [...scores]
//             updatedScores[existingIndex] = {
//                 ...updatedScores[existingIndex],
//                 score,
//                 note: notes[skillCode] || "",
//             }
//             setScores(updatedScores)
//         } else {
//             // Add new score
//             setScores([...scores, { skillCode, score, note: notes[skillCode] || "" }])
//         }
//     }

//     // Function to handle note changes
//     const handleNoteChange = (skillCode, note) => {
//         // Update notes state
//         setNotes({
//             ...notes,
//             [skillCode]: note,
//         })

//         // Update score entry if it exists
//         const existingIndex = scores.findIndex((entry) => entry.skillCode === skillCode)
//         if (existingIndex >= 0) {
//             const updatedScores = [...scores]
//             updatedScores[existingIndex] = {
//                 ...updatedScores[existingIndex],
//                 note,
//             }
//             setScores(updatedScores)
//         }
//     }

//     // Function to handle form submission
//     const handleSubmit =  async (e) => {
//         e.preventDefault()

//         // Create the payload
//         const payload = {
//             playerRegistrationId: player.id,
//             scores: scores.map((item) => ({
//                 skillCode: item.skillCode,
//                 score: item.score,
//                 note: item.note || "",
//             })),
//         }

//         // Log the payload (in a real app, you would send this to an API)
//         console.log("Submitting scores:", payload)
//         try{
//             const response = await tryOutApi.addSinglePlayerScore(payload);
//             console.log(response.data);
            
//             addToast({
//                 message: response.data.message,
//                 type: "success",
//             })
//             if (response.data.status == "Success") {
//                 await registerApi.updatePlayerFormById(player.id, "Scored")
//             }
//         } catch (error) {
//             console.error("Error submitting scores:", error)
//         }
//         // Close the popup
//         onClose()
//     }

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//                 <DialogHeader className="flex flex-row items-center justify-between">
//                     <DialogTitle className="text-xl font-bold text-[#bd2427]">Chấm điểm kỹ năng và thể lực</DialogTitle>
//                 </DialogHeader>

//                 {/* Player Information */}
//                 <div className="bg-gray-50 p-4 rounded-md mb-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <p className="text-sm text-gray-500">Người chơi</p>
//                             <p className="font-medium">{player.name}</p>
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Đợt đăng ký</p>
//                             <p className="font-medium">{player.registrationName}</p>
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Giới tính</p>
//                             <p className="font-medium">{player.gender}</p>
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Email</p>
//                             <p className="font-medium">{player.email}</p>
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Số báo danh</p>
//                             <p className="font-medium">{player.candidateNumber}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     {/* Basketball Skills Card */}
//                     <Card className="mb-6">
//                         <CardHeader className="bg-gray-50">
//                             <CardTitle className="text-lg font-bold text-[#bd2427]">Kỹ năng bóng rổ</CardTitle>
//                         </CardHeader>
//                         <CardContent className="pt-6">
//                             <div className="space-y-6">
//                                 {/* Dẫn bóng */}
//                                 <div className="border-b pb-4">
//                                     <h3 className="font-medium mb-2">Dẫn bóng</h3>
//                                     <RadioGroup
//                                         value={formValues.Dribble}
//                                         onValueChange={(value) => handleScoreChange("Dribble", value)}
//                                         className="flex flex-row space-x-4"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="T" id="dribble-t" />
//                                             <Label htmlFor="dribble-t">Tốt</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="K" id="dribble-k" />
//                                             <Label htmlFor="dribble-k">Khá</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="TB" id="dribble-tb" />
//                                             <Label htmlFor="dribble-tb">Trung bình</Label>
//                                         </div>
//                                     </RadioGroup>
//                                 </div>

//                                 {/* Chuyền bóng */}
//                                 <div className="border-b pb-4">
//                                     <h3 className="font-medium mb-2">Chuyền bóng</h3>
//                                     <RadioGroup
//                                         value={formValues.Passing}
//                                         onValueChange={(value) => handleScoreChange("Passing", value)}
//                                         className="flex flex-row space-x-4"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="T" id="passing-t" />
//                                             <Label htmlFor="passing-t">Tốt</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="K" id="passing-k" />
//                                             <Label htmlFor="passing-k">Khá</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="TB" id="passing-tb" />
//                                             <Label htmlFor="passing-tb">Trung bình</Label>
//                                         </div>
//                                     </RadioGroup>
//                                 </div>

//                                 {/* Ném rổ */}
//                                 <div className="border-b pb-4">
//                                     <h3 className="font-medium mb-2">Ném rổ</h3>
//                                     <RadioGroup
//                                         value={formValues.Shooting}
//                                         onValueChange={(value) => handleScoreChange("Shooting", value)}
//                                         className="flex flex-row space-x-4"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="T" id="shooting-t" />
//                                             <Label htmlFor="shooting-t">Tốt</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="K" id="shooting-k" />
//                                             <Label htmlFor="shooting-k">Khá</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="TB" id="shooting-tb" />
//                                             <Label htmlFor="shooting-tb">Trung bình</Label>
//                                         </div>
//                                     </RadioGroup>
//                                 </div>

//                                 {/* Kết thúc rổ */}
//                                 <div className="border-b pb-4">
//                                     <h3 className="font-medium mb-2">Kết thúc rổ</h3>
//                                     <RadioGroup
//                                         value={formValues.Finishing}
//                                         onValueChange={(value) => handleScoreChange("Finishing", value)}
//                                         className="flex flex-row space-x-4"
//                                     >
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="T" id="finishing-t" />
//                                             <Label htmlFor="finishing-t">Tốt</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="K" id="finishing-k" />
//                                             <Label htmlFor="finishing-k">Khá</Label>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <RadioGroupItem value="TB" id="finishing-tb" />
//                                             <Label htmlFor="finishing-tb">Trung bình</Label>
//                                         </div>
//                                     </RadioGroup>
//                                 </div>

//                                 {/* Đấu tập */}
//                                 <div>
//                                     <h3 className="font-medium mb-3">Đấu tập</h3>

//                                     {/* Thái độ */}
//                                     <div className="ml-4 mb-4">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="attitude">Thái độ</Label>
//                                             <RadioGroup value={formValues.Attitude}>
//                                                 <div className="flex space-x-3">
//                                                     {[1, 2, 3, 4, 5].map((value) => (
//                                                         <div key={`attitude-${value}`} className="flex flex-col items-center">
//                                                             <RadioGroupItem
//                                                                 value={value.toString()}
//                                                                 id={`attitude-${value}`}
//                                                                 className="peer sr-only"
//                                                                 onClick={() => handleScoreChange("Attitude", value.toString())}
//                                                             />
//                                                             <Label
//                                                                 htmlFor={`attitude-${value}`}
//                                                                 className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
//                                                             >
//                                                                 {value}
//                                                             </Label>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </RadioGroup>
//                                         </div>
//                                     </div>

//                                     {/* Lãnh đạo */}
//                                     <div className="ml-4 mb-4">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="leadership">Lãnh đạo</Label>
//                                             <RadioGroup value={formValues.Leadership}>
//                                                 <div className="flex space-x-3">
//                                                     {[1, 2, 3, 4, 5].map((value) => (
//                                                         <div key={`leadership-${value}`} className="flex flex-col items-center">
//                                                             <RadioGroupItem
//                                                                 value={value.toString()}
//                                                                 id={`leadership-${value}`}
//                                                                 className="peer sr-only"
//                                                                 onClick={() => handleScoreChange("Leadership", value.toString())}
//                                                             />
//                                                             <Label
//                                                                 htmlFor={`leadership-${value}`}
//                                                                 className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
//                                                             >
//                                                                 {value}
//                                                             </Label>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </RadioGroup>
//                                         </div>
//                                     </div>

//                                     {/* Kỹ năng */}
//                                     <div className="ml-4 mb-4">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="skill">Kỹ năng</Label>
//                                             <RadioGroup value={formValues.Skills}>
//                                                 <div className="flex space-x-3">
//                                                     {[1, 2, 3, 4, 5].map((value) => (
//                                                         <div key={`skill-${value}`} className="flex flex-col items-center">
//                                                             <RadioGroupItem
//                                                                 value={value.toString()}
//                                                                 id={`skill-${value}`}
//                                                                 className="peer sr-only"
//                                                                 onClick={() => handleScoreChange("Skills", value.toString())}
//                                                             />
//                                                             <Label
//                                                                 htmlFor={`skill-${value}`}
//                                                                 className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
//                                                             >
//                                                                 {value}
//                                                             </Label>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </RadioGroup>
//                                         </div>
//                                     </div>

//                                     {/* Thể lực */}
//                                     <div className="ml-4 mb-4">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="fitness">Thể lực</Label>
//                                             <RadioGroup value={formValues.ScrimmagePhysicalFitness}>
//                                                 <div className="flex space-x-3">
//                                                     {[1, 2, 3, 4, 5].map((value) => (
//                                                         <div key={`fitness-${value}`} className="flex flex-col items-center">
//                                                             <RadioGroupItem
//                                                                 value={value.toString()}
//                                                                 id={`fitness-${value}`}
//                                                                 className="peer sr-only"
//                                                                 onClick={() => handleScoreChange("ScrimmagePhysicalFitness", value.toString())}
//                                                             />
//                                                             <Label
//                                                                 htmlFor={`fitness-${value}`}
//                                                                 className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
//                                                             >
//                                                                 {value}
//                                                             </Label>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </RadioGroup>
//                                         </div>
//                                     </div>

//                                     {/* IQ */}
//                                     <div className="ml-4 mb-4">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="iq">IQ</Label>
//                                             <RadioGroup value={formValues.BasketballIQ}>
//                                                 <div className="flex space-x-3">
//                                                     {[1, 2, 3, 4, 5].map((value) => (
//                                                         <div key={`iq-${value}`} className="flex flex-col items-center">
//                                                             <RadioGroupItem
//                                                                 value={value.toString()}
//                                                                 id={`iq-${value}`}
//                                                                 className="peer sr-only"
//                                                                 onClick={() => handleScoreChange("BasketballIQ", value.toString())}
//                                                             />
//                                                             <Label
//                                                                 htmlFor={`iq-${value}`}
//                                                                 className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
//                                                             >
//                                                                 {value}
//                                                             </Label>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </RadioGroup>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Physical Fitness Card */}
//                     <Card>
//                         <CardHeader className="bg-gray-50">
//                             <CardTitle className="text-lg font-bold text-[#bd2427]">Thể lực</CardTitle>
//                         </CardHeader>
//                         <CardContent className="pt-6">
//                             <div className="space-y-6">
//                                 {/* Hexagon Test */}
//                                 <div className="border-b pb-4">
//                                     <div className="flex justify-between items-center mb-2">
//                                         <Label htmlFor="hexagon-test">Hexagon Test (giây)</Label>
//                                         <Input
//                                             id="hexagon-test"
//                                             type="number"
//                                             placeholder="Nhập thời gian"
//                                             className="w-40"
//                                             value={formValues.HexagonTest}
//                                             onChange={(e) => handleScoreChange("HexagonTest", e.target.value)}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Bật xa tại chỗ */}
//                                 <div className="border-b pb-4">
//                                     <div className="flex justify-between items-center mb-2">
//                                         <Label htmlFor="standing-broad-jump">Bật xa tại chỗ (cm)</Label>
//                                         <Input
//                                             id="standing-broad-jump"
//                                             type="number"
//                                             placeholder="Nhập khoảng cách"
//                                             className="w-40"
//                                             value={formValues.StandingBroadJump}
//                                             onChange={(e) => handleScoreChange("StandingBroadJump", e.target.value)}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Bật cao */}
//                                 <div className="border-b pb-4">
//                                     <h3 className="font-medium mb-3">Bật cao (cm)</h3>

//                                     <div className="ml-4 space-y-4">
//                                         {/* Không đà */}
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="vertical-jump-no-step">Không đà</Label>
//                                             <Input
//                                                 id="vertical-jump-no-step"
//                                                 type="number"
//                                                 placeholder="Nhập chiều cao"
//                                                 className="w-40"
//                                                 value={formValues.StandingVerticalJump}
//                                                 onChange={(e) => handleScoreChange("StandingVerticalJump", e.target.value)}
//                                             />
//                                         </div>

//                                         {/* Có đà */}
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="vertical-jump-with-step">Có đà</Label>
//                                             <Input
//                                                 id="vertical-jump-with-step"
//                                                 type="number"
//                                                 placeholder="Nhập chiều cao"
//                                                 className="w-40"
//                                                 value={formValues.RunningVerticalJump}
//                                                 onChange={(e) => handleScoreChange("RunningVerticalJump", e.target.value)}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Nhanh nhẹn */}
//                                 <div className="border-b pb-4">
//                                     <div className="flex justify-between items-center mb-2">
//                                         <Label htmlFor="agility">Nhanh nhẹn (giây)</Label>
//                                         <Input
//                                             id="agility"
//                                             type="number"
//                                             placeholder="Nhập thời gian"
//                                             className="w-40"
//                                             value={formValues.AgilityTest}
//                                             onChange={(e) => handleScoreChange("AgilityTest", e.target.value)}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Chạy nước rút */}
//                                 <div className="border-b pb-4">
//                                     <div className="flex justify-between items-center mb-2">
//                                         <Label htmlFor="sprint">Chạy nước rút (giây)</Label>
//                                         <Input
//                                             id="sprint"
//                                             type="number"
//                                             placeholder="Nhập thời gian"
//                                             className="w-40"
//                                             value={formValues.Sprint}
//                                             onChange={(e) => handleScoreChange("Sprint", e.target.value)}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Chống đẩy */}
//                                 <div className="border-b pb-4">
//                                     <div className="flex justify-between items-center mb-2">
//                                         <Label htmlFor="push-ups">Chống đẩy (số lần)</Label>
//                                         <Input
//                                             id="push-ups"
//                                             type="number"
//                                             placeholder="Nhập số lần"
//                                             className="w-40"
//                                             value={formValues.PushUp}
//                                             onChange={(e) => handleScoreChange("PushUp", e.target.value)}
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Plank */}
//                                 <div>
//                                     <h3 className="font-medium mb-3">Plank (giây)</h3>

//                                     <div className="ml-4 space-y-4">
//                                         {/* Plank thường */}
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="plank-normal">Plank thường</Label>
//                                             <Input
//                                                 id="plank-normal"
//                                                 type="number"
//                                                 placeholder="Nhập thời gian"
//                                                 className="w-40"
//                                                 value={formValues.StandardPlank}
//                                                 onChange={(e) => handleScoreChange("StandardPlank", e.target.value)}
//                                             />
//                                         </div>

//                                         {/* Plank 1 phía */}
//                                         <div className="flex justify-between items-center mb-2">
//                                             <Label htmlFor="plank-side">Plank 1 phía</Label>
//                                             <Input
//                                                 id="plank-side"
//                                                 type="number"
//                                                 placeholder="Nhập thời gian"
//                                                 className="w-40"
//                                                 value={formValues.PlankSide}
//                                                 onChange={(e) => handleScoreChange("PlankSide", e.target.value)}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <div className="mt-6 flex justify-end space-x-4">
//                         <Button type="button" variant="outline" onClick={onClose}>
//                             Hủy
//                         </Button>
//                         <Button type="submit">Lưu điểm</Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import tryOutApi from "@/api/tryOutScore"
import { useToasts } from "@/hooks/providers/ToastProvider"
import registerApi from "@/api/register"
import { Eye } from "lucide-react"

export function ScorePopup({ open, onClose, player }) {
  // State to store all scores
  const [scores, setScores] = useState([])
  const [notes, setNotes] = useState({})
  const [formValues, setFormValues] = useState({
    // Basketball skills
    Dribble: "",
    Passing: "",
    Shooting: "",
    Finishing: "",
    Attitude: "",
    Leadership: "",
    Skills: "",
    ScrimmagePhysicalFitness: "",
    BasketballIQ: "",
    // Physical fitness
    HexagonTest: "",
    StandingBroadJump: "",
    StandingVerticalJump: "",
    RunningVerticalJump: "",
    AgilityTest: "",
    Sprint: "",
    PushUp: "",
    StandardPlank: "",
    PlankSide: "",
  })
  const { addToast } = useToasts()

  // Function to handle score changes
  const handleScoreChange = (skillCode, score) => {
    // Update formValues state
    setFormValues((prev) => ({
      ...prev,
      [skillCode]: score,
    }))

    // Check if this skill already has a score
    const existingIndex = scores.findIndex((entry) => entry.skillCode === skillCode)

    if (existingIndex >= 0) {
      // Update existing score
      const updatedScores = [...scores]
      updatedScores[existingIndex] = {
        ...updatedScores[existingIndex],
        score,
        note: notes[skillCode] || "",
      }
      setScores(updatedScores)
    } else {
      // Add new score
      setScores([...scores, { skillCode, score, note: notes[skillCode] || "" }])
    }
  }

  // Function to handle note changes
  const handleNoteChange = (skillCode, note) => {
    // Update notes state
    setNotes({
      ...notes,
      [skillCode]: note,
    })

    // Update score entry if it exists
    const existingIndex = scores.findIndex((entry) => entry.skillCode === skillCode)
    if (existingIndex >= 0) {
      const updatedScores = [...scores]
      updatedScores[existingIndex] = {
        ...updatedScores[existingIndex],
        note,
      }
      setScores(updatedScores)
    }
  }

  // Add a view function after the handleNoteChange function
  const handleView = (skillCode) => {
    window.open(`http://localhost:3000/dashboard/tryout-score?measurementScaleCode=${skillCode}`, "_blank")
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create the payload
    const payload = {
      playerRegistrationId: player.id,
      scores: scores.map((item) => ({
        skillCode: item.skillCode,
        score: item.score,
        note: item.note || "",
      })),
    }

    // Log the payload (in a real app, you would send this to an API)
    console.log("Submitting scores:", payload)
    try {
      const response = await tryOutApi.addSinglePlayerScore(payload)
      console.log(response.data)

      addToast({
        message: response.data.message,
        type: "success",
      })
      if (response.data.status == "Success") {
        await registerApi.updatePlayerFormById(player.id, "Scored")
      }
    } catch (error) {
      console.error("Error submitting scores:", error)
    }
    // Close the popup
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-[#bd2427]">Chấm điểm kỹ năng và thể lực</DialogTitle>
        </DialogHeader>

        {/* Player Information */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Người chơi</p>
              <p className="font-medium">{player.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Đợt đăng ký</p>
              <p className="font-medium">{player.registrationName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Giới tính</p>
              <p className="font-medium">{player.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{player.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số báo danh</p>
              <p className="font-medium">{player.candidateNumber}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basketball Skills Card */}
          <Card className="mb-6">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg font-bold text-[#bd2427]">Kỹ năng bóng rổ</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Dẫn bóng */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">
                    Dẫn bóng
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleView("Dribble")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </h3>
                  <RadioGroup
                    value={formValues.Dribble}
                    onValueChange={(value) => handleScoreChange("Dribble", value)}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="T" id="dribble-t" />
                      <Label htmlFor="dribble-t">Tốt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="K" id="dribble-k" />
                      <Label htmlFor="dribble-k">Khá</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="TB" id="dribble-tb" />
                      <Label htmlFor="dribble-tb">Trung bình</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Chuyền bóng */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">
                    Chuyền bóng
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleView("Passing")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </h3>
                  <RadioGroup
                    value={formValues.Passing}
                    onValueChange={(value) => handleScoreChange("Passing", value)}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="T" id="passing-t" />
                      <Label htmlFor="passing-t">Tốt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="K" id="passing-k" />
                      <Label htmlFor="passing-k">Khá</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="TB" id="passing-tb" />
                      <Label htmlFor="passing-tb">Trung bình</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Ném rổ */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">
                    Ném rổ
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleView("Shooting")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </h3>
                  <RadioGroup
                    value={formValues.Shooting}
                    onValueChange={(value) => handleScoreChange("Shooting", value)}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="T" id="shooting-t" />
                      <Label htmlFor="shooting-t">Tốt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="K" id="shooting-k" />
                      <Label htmlFor="shooting-k">Khá</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="TB" id="shooting-tb" />
                      <Label htmlFor="shooting-tb">Trung bình</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Kết thúc rổ */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">
                    Kết thúc rổ
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleView("Finishing")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </h3>
                  <RadioGroup
                    value={formValues.Finishing}
                    onValueChange={(value) => handleScoreChange("Finishing", value)}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="T" id="finishing-t" />
                      <Label htmlFor="finishing-t">Tốt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="K" id="finishing-k" />
                      <Label htmlFor="finishing-k">Khá</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="TB" id="finishing-tb" />
                      <Label htmlFor="finishing-tb">Trung bình</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Đấu tập */}
                <div>
                  <h3 className="font-medium mb-3">
                    Đấu tập
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleView("Scrimmage")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </h3>

                  {/* Thái độ */}
                  <div className="ml-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="attitude">
                        Thái độ
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("Attitude")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <RadioGroup value={formValues.Attitude}>
                        <div className="flex space-x-3">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <div key={`attitude-${value}`} className="flex flex-col items-center">
                              <RadioGroupItem
                                value={value.toString()}
                                id={`attitude-${value}`}
                                className="peer sr-only"
                                onClick={() => handleScoreChange("Attitude", value.toString())}
                              />
                              <Label
                                htmlFor={`attitude-${value}`}
                                className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
                              >
                                {value}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Lãnh đạo */}
                  <div className="ml-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="leadership">
                        Lãnh đạo
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("Leadership")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <RadioGroup value={formValues.Leadership}>
                        <div className="flex space-x-3">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <div key={`leadership-${value}`} className="flex flex-col items-center">
                              <RadioGroupItem
                                value={value.toString()}
                                id={`leadership-${value}`}
                                className="peer sr-only"
                                onClick={() => handleScoreChange("Leadership", value.toString())}
                              />
                              <Label
                                htmlFor={`leadership-${value}`}
                                className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
                              >
                                {value}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Kỹ năng */}
                  <div className="ml-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="skill">
                        Kỹ năng
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("Skills")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <RadioGroup value={formValues.Skills}>
                        <div className="flex space-x-3">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <div key={`skill-${value}`} className="flex flex-col items-center">
                              <RadioGroupItem
                                value={value.toString()}
                                id={`skill-${value}`}
                                className="peer sr-only"
                                onClick={() => handleScoreChange("Skills", value.toString())}
                              />
                              <Label
                                htmlFor={`skill-${value}`}
                                className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
                              >
                                {value}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Thể lực */}
                  <div className="ml-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="fitness">
                        Thể lực
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("ScrimmagePhysicalFitness")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <RadioGroup value={formValues.ScrimmagePhysicalFitness}>
                        <div className="flex space-x-3">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <div key={`fitness-${value}`} className="flex flex-col items-center">
                              <RadioGroupItem
                                value={value.toString()}
                                id={`fitness-${value}`}
                                className="peer sr-only"
                                onClick={() => handleScoreChange("ScrimmagePhysicalFitness", value.toString())}
                              />
                              <Label
                                htmlFor={`fitness-${value}`}
                                className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
                              >
                                {value}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* IQ */}
                  <div className="ml-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="iq">
                        IQ
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("BasketballIQ")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <RadioGroup value={formValues.BasketballIQ}>
                        <div className="flex space-x-3">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <div key={`iq-${value}`} className="flex flex-col items-center">
                              <RadioGroupItem
                                value={value.toString()}
                                id={`iq-${value}`}
                                className="peer sr-only"
                                onClick={() => handleScoreChange("BasketballIQ", value.toString())}
                              />
                              <Label
                                htmlFor={`iq-${value}`}
                                className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-200 peer-data-[state=checked]:bg-[#bd2427] peer-data-[state=checked]:text-white cursor-pointer hover:bg-gray-100"
                              >
                                {value}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Fitness Card */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg font-bold text-[#bd2427]">Thể lực</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Hexagon Test */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="hexagon-test">
                      Hexagon Test (giây)
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleView("HexagonTest")}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem</span>
                      </Button>
                    </Label>
                    <Input
                      id="hexagon-test"
                      type="number"
                      placeholder="Nhập thời gian"
                      className="w-40"
                      value={formValues.HexagonTest}
                      onChange={(e) => handleScoreChange("HexagonTest", e.target.value)}
                    />
                  </div>
                </div>

                {/* Bật xa tại chỗ */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="standing-broad-jump">
                      Bật xa tại chỗ (cm)
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleView("StandingBroadJump")}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem</span>
                      </Button>
                    </Label>
                    <Input
                      id="standing-broad-jump"
                      type="number"
                      placeholder="Nhập khoảng cách"
                      className="w-40"
                      value={formValues.StandingBroadJump}
                      onChange={(e) => handleScoreChange("StandingBroadJump", e.target.value)}
                    />
                  </div>
                </div>

                {/* Bật cao */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-3">
                    Bật cao (cm)
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleView("VerticalJump")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </h3>

                  <div className="ml-4 space-y-4">
                    {/* Không đà */}
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="vertical-jump-no-step">
                        Không đà
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("StandingVerticalJump")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <Input
                        id="vertical-jump-no-step"
                        type="number"
                        placeholder="Nhập chiều cao"
                        className="w-40"
                        value={formValues.StandingVerticalJump}
                        onChange={(e) => handleScoreChange("StandingVerticalJump", e.target.value)}
                      />
                    </div>

                    {/* Có đà */}
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="vertical-jump-with-step">
                        Có đà
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("RunningVerticalJump")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <Input
                        id="vertical-jump-with-step"
                        type="number"
                        placeholder="Nhập chiều cao"
                        className="w-40"
                        value={formValues.RunningVerticalJump}
                        onChange={(e) => handleScoreChange("RunningVerticalJump", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Nhanh nhẹn */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="agility">
                      Nhanh nhẹn (giây)
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleView("AgilityTest")}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem</span>
                      </Button>
                    </Label>
                    <Input
                      id="agility"
                      type="number"
                      placeholder="Nhập thời gian"
                      className="w-40"
                      value={formValues.AgilityTest}
                      onChange={(e) => handleScoreChange("AgilityTest", e.target.value)}
                    />
                  </div>
                </div>

                {/* Chạy nước rút */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="sprint">
                      Chạy nước rút (giây)
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleView("Sprint")}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem</span>
                      </Button>
                    </Label>
                    <Input
                      id="sprint"
                      type="number"
                      placeholder="Nhập thời gian"
                      className="w-40"
                      value={formValues.Sprint}
                      onChange={(e) => handleScoreChange("Sprint", e.target.value)}
                    />
                  </div>
                </div>

                {/* Chống đẩy */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="push-ups">
                      Chống đẩy (số lần)
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleView("PushUp")}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem</span>
                      </Button>
                    </Label>
                    <Input
                      id="push-ups"
                      type="number"
                      placeholder="Nhập số lần"
                      className="w-40"
                      value={formValues.PushUp}
                      onChange={(e) => handleScoreChange("PushUp", e.target.value)}
                    />
                  </div>
                </div>

                {/* Plank */}
                <div>
                  <h3 className="font-medium mb-3">
                    Plank (giây)
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleView("Plank")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </h3>

                  <div className="ml-4 space-y-4">
                    {/* Plank thường */}
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="plank-normal">
                        Plank thường
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("StandardPlank")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <Input
                        id="plank-normal"
                        type="number"
                        placeholder="Nhập thời gian"
                        className="w-40"
                        value={formValues.StandardPlank}
                        onChange={(e) => handleScoreChange("StandardPlank", e.target.value)}
                      />
                    </div>

                    {/* Plank 1 phía */}
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="plank-side">
                        Plank 1 phía
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleView("PlankSide")}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem</span>
                        </Button>
                      </Label>
                      <Input
                        id="plank-side"
                        type="number"
                        placeholder="Nhập thời gian"
                        className="w-40"
                        value={formValues.PlankSide}
                        onChange={(e) => handleScoreChange("PlankSide", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu điểm</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
