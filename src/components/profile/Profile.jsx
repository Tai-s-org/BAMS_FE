// "use client"

// import { useState, useEffect } from "react"
// import ProfileHeader from "./ProfileHeader"
// import ManagerInformation from "./ManagerInfomation"
// import CoachInformation from "./CoachInformation"
// import PlayerInformation from "./PlayerInformation"
// import TeamInformation from "./TeamInfomation"
// import PersonalInformation from "./PersonalInformation"
// import accountApi from "@/api/account"
// import authApi from "@/api/auth"

// export default function UserProfile() {
//     // Sample basketball player data
//     const [user, setUser] = useState({})


//     // const handleLogin = async (formData) => {
//     //     setLoading(true);
//     //     try {
//     //         const response = await authApi.signIn(formData);
//     //         addToast({ message: response.data.message, type: "success" });
//     //         console.log(response.data.user);
//     //         login(response.data.user);
//     //         router.push('/')
//     //     } catch (error) {
//     //         if (error.response && error.response.data && error.response.data.message) {
//     //             addToast({ message: error.response.data.message, type: "error" });
//     //         }
//     //         //console.log(error.response);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const [isEditing, setIsEditing] = useState(false)
//     const [formData, setFormData] = useState({})
//     const [avatarFile, setAvatarFile] = useState(null)
//     const [avatarPreview, setAvatarPreview] = useState(null)

//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             try {
//                 const response = await accountApi.getProfile();
//                 setUser(response.data)
//                 setFormData(response.data)
//                 console.log(response.data);
//             } catch (error) {
//                 console.error("Lỗi khi lấy thông tin người dùng:", error)
//             }
//         }
//         fetchUserInfo()
//     }, [])

//     const handleInputChange = (e) => {
//         const { name, value } = e.target
//         se((prev) => ({
//             ...prev,
//             [name]: value,
//         }))
//     }

//     const handleAvatarChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0]
//             setAvatarFile(file)

//             // Create preview
//             const reader = new FileReader()
//             reader.onloadend = () => {
//                 setAvatarPreview(reader.result)
//             }
//             reader.readAsDataURL(file)
//         }
//     }

//     const handleSave = async () => {
//         setUser({
//             ...formData,
//             profileImage: avatarPreview || user.profileImage,
//         })
//         console.log(formData);
//         try {
//             const response = await accountApi.updateProfile({formData});
//             console.log(response.data.data);

//         } catch (err) {

//         }
//         setIsEditing(false)
//         setAvatarFile(null)
//         setAvatarPreview(null)
//     }

//     const handleCancel = () => {
//         setFormData({ ...user })
//         setIsEditing(false)
//         setAvatarFile(null)
//         setAvatarPreview(null)
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 text-gray-800">
//             {user !== null && (
//                 <div className="max-w-4xl mx-auto">
//                     <ProfileHeader
//                         user={user}
//                         isEditing={isEditing}
//                         setIsEditing={setIsEditing}
//                         avatarPreview={avatarPreview}
//                         handleAvatarChange={handleAvatarChange}
//                         handleSave={handleSave}
//                         handleCancel={handleCancel}
//                     />

//                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                         <PersonalInformation
//                             user={user}
//                             isEditing={isEditing}
//                             formData={formData}
//                             handleInputChange={handleInputChange}
//                         />

//                         <TeamInformation user={user} />

//                         {user.roleCode === "Player" && (
//                             <PlayerInformation
//                                 user={user}
//                                 isEditing={isEditing}
//                                 formData={formData}
//                                 handleInputChange={handleInputChange}
//                             />
//                         )}

//                         {user.roleCode === "Coach" && (
//                             <CoachInformation
//                                 roleInformation={user.roleInformation}
//                                 isEditing={isEditing}
//                                 formData={formData}
//                                 handleInputChange={handleInputChange}
//                             />
//                         )}

//                         {user.roleCode === "Manager" && (
//                             <ManagerInformation
//                                 roleInformation={user.roleInformation}
//                                 isEditing={isEditing}
//                                 formData={formData}
//                                 handleInputChange={handleInputChange} />
//                         )}
//                     </div>
//                 </div>
//             )}

//         </div>
//     )
// }

"use client"

import { useState, useEffect } from "react"
import ProfileHeader from "./ProfileHeader"
import ManagerInformation from "./ManagerInfomation"
import CoachInformation from "./CoachInformation"
import PlayerInformation from "./PlayerInformation"
import TeamInformation from "./TeamInfomation"
import PersonalInformation from "./PersonalInformation"
import accountApi from "@/api/account"
import { useToasts } from "@/hooks/providers/ToastProvider"

export default function UserProfile() {
    const [user, setUser] = useState({})
    const [formData, setFormData] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const { addToast } = useToasts()

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await accountApi.getProfile()
                console.log(response.data);
                
                setUser(response.data)
                setFormData(response.data)


            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error)
            }
        }
        fetchUserInfo()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target

        if (name.startsWith("roleInformation.")) {
            const key = name.replace("roleInformation.", "")
            setFormData((prev) => ({
                ...prev,
                roleInformation: {
                    ...prev.roleInformation,
                    [key]: value,
                },
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setAvatarFile(file)

            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        const updatedUser = {
            ...formData,
            profileImage: avatarPreview || user.profileImage,
        }
        console.log(updatedUser)
        try {
            const response = await accountApi.updateProfile(updatedUser)
            console.log(response);
            
            addToast({
                message: response.data.message,
                type: "success",
            })  
            setUser(updatedUser)
        } catch (err) {
            console.error("Cập nhật thất bại:", err)
        }

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
            {user && (
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
                                formData={formData}
                                roleInformation={formData.roleInformation}
                                isEditing={isEditing}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        {user.roleCode === "Manager" && (
                            <ManagerInformation
                                formData={formData}
                                roleInformation={formData.roleInformation}
                                isEditing={isEditing}
                                handleInputChange={handleInputChange}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
