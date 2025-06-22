import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserProfileBanner.css';

const UserProfileBanner = ({ userInfo = {}, profileImage, avatarImage, bannerImage, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editInfo, setEditInfo] = useState({ ...userInfo });
    const [previewBannerImage, setPreviewBannerImage] = useState(bannerImage);
    const [previewAvatarImage, setPreviewAvatarImage] = useState(avatarImage);
    const [bannerFile, setBannerFile] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const { user } = useAuth();
    
    const fileInputRef = useRef(null);
    const avatarInputRef = useRef(null);

    // 이미지 크기 조절 함수 추가
    const resizeImage = (file, maxWidth, maxHeight) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                
                // 원본 이미지 크기
                let width = img.width;
                let height = img.height;
                
                // 최대 크기에 맞게 비율 조절
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }
                
                // 캔버스에 이미지 그리기
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // 이미지 데이터 URL로 변환
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, { type: file.type }));
                }, file.type);
            };
        });
    };

    // userInfo, bannerImage, avatarImage가 변경될 때 상태 업데이트
    useEffect(() => {
        setEditInfo({ ...userInfo });
        setPreviewBannerImage(bannerImage);
        setPreviewAvatarImage(avatarImage);
    }, [userInfo, bannerImage, avatarImage]);

    // 배너 드래그 앤 드롭 핸들러
    const handleBannerDragOver = (e) => {
        if (isEditing) {
            e.preventDefault();
        }
    };

    const handleBannerDrop = (e) => {
        if (isEditing) {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length) {
                handleBannerImageChange(files[0]);
            }
        }
    };

    const handleBannerImageChange = async (file) => {
        if (file && isEditing) {
            try {
                // 배너 이미지 크기 조절 (최대 1200x400)
                const resizedFile = await resizeImage(file, 1200, 400);
                setBannerFile(resizedFile);
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewBannerImage(e.target.result);
                };
                reader.readAsDataURL(resizedFile);
            } catch (error) {
                console.error('이미지 크기 조절 실패:', error);
            }
        }
    };

    const handleBannerFileInputChange = (e) => {
        if (e.target.files.length && isEditing) {
            handleBannerImageChange(e.target.files[0]);
        }
    };

    // 아바타 드래그 앤 드롭 핸들러
    const handleAvatarDragOver = (e) => {
        if (isEditing) {
            e.preventDefault();
        }
    };

    const handleAvatarDrop = (e) => {
        if (isEditing) {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length) {
                handleAvatarImageChange(files[0]);
            }
        }
    };

    const handleAvatarImageChange = async (file) => {
        if (file && isEditing) {
            try {
                // 아바타 이미지 크기 조절 (최대 200x200)
                const resizedFile = await resizeImage(file, 200, 200);
                setAvatarFile(resizedFile);
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewAvatarImage(e.target.result);
                };
                reader.readAsDataURL(resizedFile);
            } catch (error) {
                console.error('이미지 크기 조절 실패:', error);
            }
        }
    };

    const handleAvatarFileInputChange = (e) => {
        if (e.target.files.length && isEditing) {
            handleAvatarImageChange(e.target.files[0]);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditInfo({ ...userInfo });
        setPreviewBannerImage(bannerImage);
        setPreviewAvatarImage(avatarImage);
    };

    const handleSaveClick = async () => {
        // 이미지 파일 업로드 및 프로필 정보 업데이트
        if (onProfileUpdate) {
            try {
                await onProfileUpdate({
                    profileName: editInfo.name,
                    introduction: editInfo.bio,
                    bannerFile,
                    avatarFile
                });
                // 성공적으로 업데이트되면 편집 모드 종료
                setIsEditing(false);
                // 파일 상태 초기화
                setBannerFile(null);
                setAvatarFile(null);
            } catch (error) {
                console.error('프로필 업데이트 실패:', error);
                alert('프로필 업데이트에 실패했습니다.');
            }
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setPreviewBannerImage(bannerImage);
        setPreviewAvatarImage(avatarImage);
        setBannerFile(null);
        setAvatarFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditInfo(prev => ({ ...prev, [name]: value }));
    };

    // 실제 사용자 이름을 가져오는 함수
    const getDisplayName = () => {
        // Auth Context의 user 정보를 우선 사용 (소셜 로그인에서 가져온 실제 이름)
        return user?.name || user?.email || userInfo.name || '사용자';
    };

    return (
        <div className="user-profile-banner">
            <div 
                className={`profile-banner ${isEditing ? 'editable' : ''}`}
                onDragOver={handleBannerDragOver}
                onDrop={handleBannerDrop}
                onClick={() => isEditing && fileInputRef.current.click()}
            >
                {previewBannerImage ? (
                    <img src={previewBannerImage} alt="프로필 배너" className="profile-banner-image" />
                ) : (
                    <div className="profile-banner-placeholder">
                        <p>{isEditing ? '이미지를 드래그하거나 클릭하여 업로드' : '배너 이미지가 없습니다'}</p>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleBannerFileInputChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={!isEditing}
                />
                {isEditing && (
                    <div className="banner-edit-overlay">
                        <span>배너 이미지 변경하기</span>
                    </div>
                )}
            </div>

            <div className="profile-info-container">
                <div className="profile-info">
                    {isEditing ? (
                        <div className="profile-edit-form">
                            {/* 이름 필드를 프로필 이름과 동일한 스타일로 표시 */}
                            <h2 className="readonly-name">{getDisplayName()}</h2>
                            <textarea
                                name="bio"
                                value={editInfo.bio}
                                onChange={handleInputChange}
                                className="edit-bio-input"
                                placeholder="자기소개를 입력하세요"
                            />
                            <div className="edit-buttons">
                                <button onClick={handleSaveClick} className="save-button">저장</button>
                                <button onClick={handleCancelClick} className="cancel-button">취소</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="profile-name">{getDisplayName()}</h2>
                            <p className="profile-bio">{userInfo.bio || '소개글이 없습니다.'}</p>
                            <button onClick={handleEditClick} className="edit-profile-button">
                                프로필 수정
                            </button>
                        </>
                    )}
                </div>
                
                <div 
                    className={`profile-avatar ${isEditing ? 'editable' : ''}`}
                    onDragOver={handleAvatarDragOver}
                    onDrop={handleAvatarDrop}
                    onClick={() => isEditing && avatarInputRef.current.click()}
                >
                    {previewAvatarImage ? (
                        <img src={previewAvatarImage} alt="프로필 아바타" className="avatar-image" />
                    ) : (
                        <div className="avatar-circle">
                            {getDisplayName().charAt(0).toUpperCase()}
                        </div>
                    )}
                    <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarFileInputChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={!isEditing}
                    />
                    {isEditing && (
                        <div className="avatar-edit-overlay">
                            <span>프로필 사진 변경</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileBanner;
