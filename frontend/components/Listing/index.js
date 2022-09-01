import { useState, useEffect, useContext } from 'react'
import { AirBnbContext } from '../../context/context'
import { useAddress, useSigner } from '@thirdweb-dev/react'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
import ListingCard from './ListingCard'
import style from '../../styles/listing.module.css'
import 'mapbox-gl/dist/mapbox-gl.css'

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibGFuZ2ZvcmQyMSIsImEiOiJjbDNrZmdlNDEyMTNxM2NwNjJ3YjJkcmd3In0.nlsUKSUeCMTU_K5X8WF3tQ',
})

const mapStyleProps = {
  height: '100vh',
  width: '100%',
}

const Listing = () => {
  const signer = useSigner()
  const address = useAddress()
  const [inventories, setInventories] = useState([])
  const { setLoading } = useContext(AirBnbContext)

  useEffect(() => {
    if (address) {
      /** Hide loader when page loaded */
      setLoading(false)
      getListings()
      setInventories(inventories)
    }
  }, [address])

  useEffect(() => {
    const intervalId = setInterval(() => {
      getListings()
    }, 5000);

    /** clear interval on re-render to avoid memory leaks */
    return () => clearInterval(intervalId);
  })


  const getListings = async () => {
    try {
      /** Get NFTs from thirdweb NFT collection contract */
      const nftList = []
      const sdk = new ThirdwebSDK(signer)
      const contract = sdk.getNFTCollection(process.env.NEXT_PUBLIC_COLLECTION_ADDRESS)
      const nfts = await contract.getAll()

      nfts.forEach(nft => {
        nftList.push(nft.metadata)
      })

      setInventories(nftList)
    } catch (e) {
      console.warn(e.message)
    }
  }

  return (
    <>
      <div className={style.Listing}>
        <div className={style.ListingWrapper}>
          <p>300+ stays</p>
          <h1>Stays in selected map areas</h1>
          <ul className={style.ListingFilterContainer}>
            <li className={style.ListingFilter}>Cancelation flexibility</li>
            <li className={style.ListingFilter}>Instant Book</li>
            <li className={style.ListingFilter}>Entire place</li>
            <li className={style.ListingFilter}>More filters: 3</li>
          </ul>
          <p>Review COVID-19 travel restrictions before you book.</p>
          <div className={style.ListingsGrid}>
            {
              inventories.length > 0
                ? inventories.map((inventory, i) => (
                  <ListingCard
                    key={i}
                    inventoryId={i}
                    inventory={inventory}
                  />
                )) : <h3>Fetching listings...</h3>
            }
          </div>
        </div>
        <div className={style.MapWrapper}>
          <Map
            style='mapbox://styles/langford21/cl3kgp2eo001v15qloz7msiib'
            containerStyle={mapStyleProps}
          >
            <Layer
              type='symbol'
              id='marker'
              layout={{ 'icon-image': 'marker-15' }}
            >
              <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
            </Layer>
          </Map>
        </div>
      </div>
    </>
  )
}

export default Listing
