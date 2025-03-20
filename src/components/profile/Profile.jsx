"use client"

import { useState, useEffect } from "react"
import ProfileHeader from "./ProfileHeader"
import ManagerInformation from "./ManagerInfomation"
import CoachInformation from "./CoachInformation"
import PlayerInformation from "./PlayerInformation"
import TeamInformation from "./TeamInfomation"
import PersonalInformation from "./PersonalInformation"
import accountApi from "@/api/account"

export default function UserProfile() {
    // Sample basketball player data
    const [user, setUser] = useState({
        // username: "mvp23",
        // fullname: "Nguyễn Hoàng Long",
        // email: "hoanglong@bball.vn",
        // profileImage: "/placeholder.svg?height=300&width=300",
        // phone: "0912 345 678",
        // address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
        // dateOfBirth: "1995-06-15",
        // roleName: "Manager", // Changed from roleCode to roleName
        // createdAt: "2022-03-10T14:30:00Z",
        // updatedAt: "2023-11-05T09:45:00Z",
        // teamName: "Saigon Heat",
        // bankName: "Ngân hàng TMCP Ngoại thương Việt Nam",
        // bankAccountNumber: "****-****-****-5678",
        // jerseyNumber: "23",
        // // Player specific fields
        // parentId: "d38c979a-39d2-4b05-bf62-76266e8bcbab",
        // teamId: "1",
        // relationshipWithParent: "Son",
        // weight: 78,
        // height: 180,
        // position: "Tiền Vệ",
        // shirtNumber: 10,
        // joinDate: "2022-01-15",
        // // Coach specific fields
        // bio: "Huấn luyện viên với hơn 10 năm kinh nghiệm trong lĩnh vực bóng rổ chuyên nghiệp.",
        // contractStartDate: "2022-01-01",
        // contractEndDate: "2024-12-31",
    })


    // const handleLogin = async (formData) => {
    //     setLoading(true);
    //     try {
    //         const response = await authApi.signIn(formData);
    //         addToast({ message: response.data.message, type: "success" });
    //         console.log(response.data.user);
    //         login(response.data.user);
    //         router.push('/')
    //     } catch (error) {
    //         if (error.response && error.response.data && error.response.data.message) {
    //             addToast({ message: error.response.data.message, type: "error" });
    //         }
    //         //console.log(error.response);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await accountApi.getProfile();
                setUser(response.data)
                setFormData(response.data)
                console.log(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error)
            }
        }
        fetchUserInfo()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setAvatarFile(file)

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        setUser({
            ...formData,
            profileImage: avatarPreview || user.profileImage,
        })
        console.log(formData);

        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview(null)
    }

    const handleCancel = () => {
        setFormData({ ...user })
        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 text-gray-800">
            {user !== null && (
                <div className="max-w-4xl mx-auto">
                    <ProfileHeader
                        user={user}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        avatarPreview={avatarPreview}
                        handleAvatarChange={handleAvatarChange}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <PersonalInformation
                            user={user}
                            isEditing={isEditing}
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />

                        <TeamInformation user={user} />

                        {user.roleCode === "Player" && (
                            <PlayerInformation
                                user={user}
                                isEditing={isEditing}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {user.roleCode === "Coach" && (
                            <CoachInformation
                                roleInformation={user.roleInformation}
                                isEditing={isEditing}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {user.roleCode === "Manager" && (
                            <ManagerInformation
                                roleInformation={user.roleInformation}
                                isEditing={isEditing}
                                formData={formData}
                                handleInputChange={handleInputChange} />
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}

