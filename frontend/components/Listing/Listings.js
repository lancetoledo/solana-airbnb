import ListingItem from './ListingItem'

function Listings({ connected, showReservedListing, listings, openEditListingModal, openReserveListingModal, removeListing }) {
    return (
        <div className="px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {listings.map((listing) => (
                    <ListingItem key={listing.id} {...listing} connected={connected} showReservedListing={showReservedListing} removeListing={removeListing} openEditListingModal={openEditListingModal} openReserveListingModal={openReserveListingModal} />
                ))}
            </div>
        </div>
    )
}

export default Listings
