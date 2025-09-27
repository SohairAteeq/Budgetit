import NavbarHome from "../components/NavbarHome.jsx"

const Home = () => {
    return (
        <div>
            <NavbarHome/>
            <div className="bg-red-500 dark:bg-blue-500 p-4 text-white">
  Test Dark Mode
</div>
        </div>
    )
}

export default Home;