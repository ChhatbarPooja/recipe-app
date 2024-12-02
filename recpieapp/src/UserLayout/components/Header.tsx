const Header = () => {
    return (
        <>
            <div className="p-3 border-b-2">
                <div className="flex justify-between mr-10  ">
                    <div>
                        <p className="text-graydark">Hello Delicious!</p>
                    </div>
                    <div className="gap-3 flex">
                        <button>Login</button>
                        <button>Sign Up</button>
                    </div>
                </div>
            </div>
          
        </>
    )
}

export default Header
