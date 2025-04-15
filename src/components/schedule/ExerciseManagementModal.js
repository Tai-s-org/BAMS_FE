"use client"

import { useState, useEffect } from "react"
import { X, Plus, Edit, Trash2, Clock, Save } from "lucide-react"
import scheduleApi from "@/api/schedule"

export function ExerciseManagementModal({ isOpen, onClose, sessionId, initialExercises, coaches }) {
  const [exercises, setExercises] = useState(initialExercises || [])
  const [editingExercise, setEditingExercise] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isModified, setIsModified] = useState(false);
  const [newExercise, setNewExercise] = useState({
    trainingSessionId: sessionId,
    exerciseName: "",
    description: "",
    duration: 15,
    coachId: coaches[0]?.userId,
  })

  useEffect(() => {
    // Trong thực tế, bạn sẽ tải dữ liệu từ API
    fetchExercises();
  }, [sessionId, isModified])

  const fetchExercises = async () => {
    try {
      const response = await scheduleApi.getTrainingSessionById(sessionId);
      setExercises(response?.data.data.exercises);
      
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bài tập:", error);
    }
  };

  const handleAddExercise = () => {
    setIsAdding(true)
    setEditingExercise(null)
    setNewExercise({
      trainingSessionId: sessionId,
      exerciseName: "",
      description: "",
      duration: 15,
      coachId: coaches[0]?.userId,
    });
  }

  const handleEditExercise = (exercise) => {
    setEditingExercise({ ...exercise })
    setIsAdding(false)
  }

  const handleDeleteExercise = async (id) => {
    try {
      const response = await scheduleApi.deleteExercise(id);
      setIsModified(!isModified);
    }
    catch (error) {
      console.error("Lỗi khi xóa bài tập:", error);
    }
  }

  const handleSaveNewExercise = async () => {
    try {
      const response = await scheduleApi.createExercise(newExercise);
      setIsModified(!isModified);
    } catch (error) {
      console.error("Lỗi khi thêm bài tập:", error.response.data);
    }
    setIsAdding(false)
  }

  const handleSaveEditedExercise = async () => {
    if (!editingExercise || !editingExercise.exerciseName) return
    try {
      let updatedExercise = {
        coachId: editingExercise.coachId,
        description: editingExercise.description,
        duration: editingExercise.duration,
        exerciseId: editingExercise.exerciseId,
        exerciseName: editingExercise.exerciseName,
      }
      const response = await scheduleApi.editExercise(updatedExercise);
      setIsModified(!isModified);
    } catch (error) {
      console.error("Lỗi khi chiềnh sách bài tập:", error.response.data);
    }
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
            {exercises && <div className="space-y-4 mb-6">
              {exercises.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Chưa có bài tập nào được thêm vào.</p>
              ) : (
                exercises.map((exercise) => (
                  <div
                    key={exercise.exerciseId}
                    className={`border rounded-lg p-4 ${
                      editingExercise?.exerciseId === exercise.exerciseId ? "border-[#BD2427] bg-[#BD2427]/5" : "border-gray-200"
                    }`}
                  >
                    {editingExercise?.exerciseId === exercise.exerciseId ? (
                      <div key={exercise.exerciseId} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài tập</label>
                          <input
                            type="text"
                            name="exerciseName"
                            className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                            value={editingExercise?.exerciseName}
                            onChange={(e) => handleInputChange(e, false)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                          <textarea
                            name="description"
                            rows={2}
                            className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                            value={editingExercise?.description}
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
                              value={editingExercise?.duration}
                              onChange={(e) => handleInputChange(e, false)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Huấn luyện viên</label>
                            <select
                              name="coachId"
                              className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                              value={editingExercise?.coachId}
                              onChange={(e) => handleInputChange(e, false)}
                            >
                              {coaches.map((coach) => (
                                <option key={coach.userId} value={coach.userId}>
                                  {coach.fullname}
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
                              onClick={() => handleDeleteExercise(exercise.exerciseId)}
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
                              {coaches.find((c) => c.userId === exercise.coachId)?.fullname || "Không xác định"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>}

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
                          <option key={coach.userId} value={coach.userId}>
                            {coach.fullname}
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