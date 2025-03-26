"use client"

import { useState, useEffect } from "react"
import { X, Plus, Edit, Trash2, Clock, Save } from "lucide-react"

// Dữ liệu mẫu cho huấn luyện viên
const coaches = [
  { id: "1", name: "Nguyễn Văn A", role: "Huấn Luyện Viên Trưởng" },
  { id: "2", name: "Trần Thị B", role: "Huấn Luyện Viên Phụ" },
  { id: "3", name: "Lê Văn C", role: "Huấn Luyện Viên Thể Lực" },
]

// Dữ liệu mẫu cho bài tập
const sampleExercises = [
  {
    id: "1",
    trainingSessionId: "TS001",
    exerciseName: "Khởi động",
    description: "Chạy nhẹ quanh sân và các bài tập khởi động cơ bản",
    duration: 15,
    coachId: "1",
  },
  {
    id: "2",
    trainingSessionId: "TS001",
    exerciseName: "Ném rổ cơ bản",
    description: "Luyện tập kỹ thuật ném rổ cơ bản từ các vị trí khác nhau",
    duration: 30,
    coachId: "2",
  },
  {
    id: "3",
    trainingSessionId: "TS001",
    exerciseName: "Phòng thủ cá nhân",
    description: "Luyện tập kỹ thuật phòng thủ 1-1",
    duration: 25,
    coachId: "3",
  },
]

export function ExerciseManagementModal({ isOpen, onClose, sessionId, initialExercises }) {
  const [exercises, setExercises] = useState(initialExercises || [])
  const [editingExercise, setEditingExercise] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newExercise, setNewExercise] = useState({
    trainingSessionId: sessionId,
    exerciseName: "",
    description: "",
    duration: 15,
    coachId: coaches[0]?.id || "",
  })

  useEffect(() => {
    // Trong thực tế, bạn sẽ tải dữ liệu từ API
    // setExercises(sampleExercises.filter((ex) => ex.trainingSessionId === sessionId))
  }, [sessionId])

  const handleAddExercise = () => {
    setIsAdding(true)
    setEditingExercise(null)
  }

  const handleEditExercise = (exercise) => {
    setEditingExercise({ ...exercise })
    setIsAdding(false)
  }

  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const handleSaveNewExercise = () => {
    if (!newExercise.exerciseName) return

    const newId = Math.max(...exercises.map((ex) => Number.parseInt(ex.id || "0"))) + 1
    const exerciseToAdd = {
      ...newExercise,
      id: newId.toString(),
    }

    setExercises([...exercises, exerciseToAdd])
    setNewExercise({
      trainingSessionId: sessionId,
      exerciseName: "",
      description: "",
      duration: 15,
      coachId: coaches[0]?.id || "",
    })
    setIsAdding(false)
  }

  const handleSaveEditedExercise = () => {
    if (!editingExercise || !editingExercise.exerciseName) return

    setExercises(exercises.map((ex) => (ex.id === editingExercise.id ? editingExercise : ex)))
    setEditingExercise(null)
  }

  const handleCancelEdit = () => {
    setEditingExercise(null)
    setIsAdding(false)
  }

  const handleInputChange = (e, isForNewExercise) => {
    const { name, value } = e.target

    if (isForNewExercise) {
      setNewExercise((prev) => ({
        ...prev,
        [name]: name === "duration" ? Number.parseInt(value) || 0 : value,
      }))
    } else if (editingExercise) {
      setEditingExercise((prev) => ({
        ...prev,
        [name]: name === "duration" ? Number.parseInt(value) || 0 : value,
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-[#BD2427] px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
              Quản Lý Chi Tiết Buổi Tập
            </h3>
            <button
              type="button"
              className="bg-[#BD2427] rounded-md text-white hover:text-gray-200 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Đóng</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-6 py-5">
            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Danh Sách Bài Tập</h4>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                onClick={handleAddExercise}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm Bài Tập
              </button>
            </div>

            {/* Danh sách bài tập */}
            <div className="space-y-4 mb-6">
              {exercises.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Chưa có bài tập nào được thêm vào.</p>
              ) : (
                exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`border rounded-lg p-4 ${
                      editingExercise?.id === exercise.id ? "border-[#BD2427] bg-[#BD2427]/5" : "border-gray-200"
                    }`}
                  >
                    {editingExercise?.id === exercise.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài tập</label>
                          <input
                            type="text"
                            name="exerciseName"
                            className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                            value={editingExercise.exerciseName}
                            onChange={(e) => handleInputChange(e, false)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                          <textarea
                            name="description"
                            rows={2}
                            className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                            value={editingExercise.description}
                            onChange={(e) => handleInputChange(e, false)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
                            <input
                              type="number"
                              name="duration"
                              min="1"
                              className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                              value={editingExercise.duration}
                              onChange={(e) => handleInputChange(e, false)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Huấn luyện viên</label>
                            <select
                              name="coachId"
                              className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                              value={editingExercise.coachId}
                              onChange={(e) => handleInputChange(e, false)}
                            >
                              {coaches.map((coach) => (
                                <option key={coach.id} value={coach.id}>
                                  {coach.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                            onClick={handleCancelEdit}
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                            onClick={handleSaveEditedExercise}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-base font-medium text-gray-900">{exercise.exerciseName}</h5>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="text-gray-400 hover:text-[#BD2427]"
                              onClick={() => handleEditExercise(exercise)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-red-600"
                              onClick={() => handleDeleteExercise(exercise.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{exercise.description}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-gray-400" />
                            <span>{exercise.duration} phút</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">HLV:</span>
                            <span className="ml-1">
                              {coaches.find((c) => c.id === exercise.coachId)?.name || "Không xác định"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Form thêm bài tập mới */}
            {isAdding && (
              <div className="border border-[#BD2427] rounded-lg p-4 bg-[#BD2427]/5 mb-4">
                <h5 className="text-base font-medium text-gray-900 mb-3">Thêm Bài Tập Mới</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài tập</label>
                    <input
                      type="text"
                      name="exerciseName"
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                      value={newExercise.exerciseName}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Nhập tên bài tập"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      name="description"
                      rows={2}
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                      value={newExercise.description}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Mô tả chi tiết bài tập"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
                      <input
                        type="number"
                        name="duration"
                        min="1"
                        className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                        value={newExercise.duration}
                        onChange={(e) => handleInputChange(e, true)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Huấn luyện viên</label>
                      <select
                        name="coachId"
                        className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                        value={newExercise.coachId}
                        onChange={(e) => handleInputChange(e, true)}
                      >
                        {coaches.map((coach) => (
                          <option key={coach.id} value={coach.id}>
                            {coach.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                      onClick={handleSaveNewExercise}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}