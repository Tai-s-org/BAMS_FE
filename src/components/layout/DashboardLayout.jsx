import useAuth from "@/hooks/useAuth";
import Footer from "../Footer";
import Header from "./dashboard/Header";
import Sidebar from "./dashboard/Sidebar";
import OwnerSidebar from "./dashboard/OwnerSidebar";
import LibrarianSidebar from "./dashboard/LibrarianSidebar";

const DashboardLayout = ({ children }) => {
    const { isAdmin, isOwner, isLibrarian } = useAuth();

    return (
        <div className="flex grow">
            {isAdmin() && <Sidebar />}
            {isOwner() && <OwnerSidebar />}
            {isLibrarian() && <LibrarianSidebar />}
            <div className="wrapper flex grow flex-col">
                <Header />
                <main className="grow content pt-5" id="content" role="content">
                    <div className="container-fixed" id="content_container"></div>
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;
