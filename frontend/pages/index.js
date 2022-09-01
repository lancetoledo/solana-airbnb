import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterMenu from '../components/FilterMenu'
import Listings from '../components/listing/Listings'
import { useMemo, useState } from 'react'
import listingsData from '../data/listings'
import AddListingModal from '../components/listing/AddListingModal'
import EditListingModal from '../components/listing/EditListingModal'
import { useWallet } from '@solana/wallet-adapter-react'
import ReserveListingModal from '../components/listing/ReserveListingModal'
import { format } from 'date-fns'

export default function Home() {
    const { connected, publicKey } = useWallet()
    const [showReservedListing, setShowReservedListing] = useState(false)
    const [listings, setListings] = useState(listingsData)
    const [addListingModalOpen, setAddListingModalOpen] = useState(false)
    const [editListingModalOpen, setEditListingModalOpen] = useState(false)
    const [reserveListingModalOpen, setReserveListingModalOpen] = useState(false)
    const [currentEditListingID, setCurrentEditListingID] = useState(null)
    const [currentReserveListingID, setCurrentReserveListingID] = useState(null)
    const currentEditListing = useMemo(() => listings.find((listing) => listing.id === currentEditListingID), [currentEditListingID])
    const displayListings = useMemo(() => (showReservedListing ? listings.filter((listing) => listing.isReserved) : listings), [showReservedListing, listings])

    const toggleShowReservedListing = () => {
        setShowReservedListing(!showReservedListing)
    }

    const addListing = ({ location, country, price, description, imageURL }) => {
        const id = listings.length + 1

        setListings([
            ...listings,
            {
                id,
                location: {
                    name: location,
                    country: country,
                },
                description,
                distance: {
                    km: 0,
                },
                price: {
                    perNight: price,
                },
                rating: 5,
                imageURL,
            },
        ])
    }

    const openEditListingModal = (listingID) => {
        setCurrentEditListingID(listingID)

        setEditListingModalOpen(true)
    }

    const editListing = ({ id, location, country, price, description, imageURL }) => {
        setListings(
            listings.map((listing) => {
                console.log(listing.location)
                if (listing.id === id) {
                    return {
                        ...listing,
                        location: {
                            name: location || listing.location.name,
                            country: country || listing.location.country,
                        },
                        description: description || listing.description,
                        distance: {
                            km: listing.distance.km,
                        },
                        price: {
                            perNight: price || listing.price.perNight,
                        },
                        imageURL: imageURL || listing.imageURL,
                    }
                }

                return listing
            })
        )
    }

    const removeListing = (listingID) => {
        setListings(listings.filter((listing) => listing.id !== listingID))
    }

    const openReserveListingModal = (listingID) => {
        setCurrentReserveListingID(listingID)

        setReserveListingModalOpen(true)
    }

    const reserveListing = ({ startDate, endDate }) => {
        const formattedStartDate = format(new Date(startDate), 'MMM d')
        const formattedEndDate = format(new Date(endDate), 'MMM d')
        const range = `${formattedStartDate} - ${formattedEndDate}`

        setListings(
            listings.map((listing) => {
                if (listing.id === currentReserveListingID) return { ...listing, isReserved: true, reservation: range }

                return listing
            })
        )
    }

    return (
        <div>
            <Head>
                <title>Airbnb Clone</title>
            </Head>

            <Header connected={connected} publicKey={publicKey} />

            <main className="pt-10 pb-20">
                <FilterMenu />

                {connected && (
                    <div className="px-20 pb-10 flex justify-end space-x-4">
                        <button onClick={toggleShowReservedListing} className="border rounded-lg p-4 text-xs font-medium">
                            {showReservedListing ? 'Reserved' : 'All'}
                        </button>
                        <button onClick={() => setAddListingModalOpen(true)} className="border rounded-lg p-4 text-xs font-medium">
                            Add Listing
                        </button>
                    </div>
                )}

                <Listings connected={connected} showReservedListing={showReservedListing} listings={displayListings} openEditListingModal={openEditListingModal} openReserveListingModal={openReserveListingModal} removeListing={removeListing} />

                <AddListingModal addListing={addListing} addListingModalOpen={addListingModalOpen} setAddListingModalOpen={setAddListingModalOpen} />
                <EditListingModal editListing={editListing} currentEditListing={currentEditListing} editListingModalOpen={editListingModalOpen} setEditListingModalOpen={setEditListingModalOpen} />
                <ReserveListingModal reserveListing={reserveListing} reserveListingModalOpen={reserveListingModalOpen} setReserveListingModalOpen={setReserveListingModalOpen} />
            </main>

            <Footer />
        </div>
    )
}
