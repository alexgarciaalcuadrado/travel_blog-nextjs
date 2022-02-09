import ProfileRender from "../../../components/profileRender/profileRender";
import { useRouter } from "next/router";

const Profile = () => {
    const router = useRouter();
    const userId = router.query.userId;
    return (
        <ProfileRender queryUserId={userId} />
    )
}

export default Profile;