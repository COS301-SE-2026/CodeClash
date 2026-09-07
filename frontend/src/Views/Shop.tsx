//This is a wow factor - i am just calling the coming soon component so the page isnt blank when clicked from dashboard

//This is code copied from Tournaments.tsx!

import ComingSoon from "@/components/ui/ComingSoon";

const Shop = () => {
    return (
        <div className="min-h-flex">
            <ComingSoon
                fullscreen={false}/>
        </div>
    )
}

export default Shop;