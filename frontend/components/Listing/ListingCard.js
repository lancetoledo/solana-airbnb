import { useRouter } from 'next/router'
import style from '../../styles/listing.module.css'
import heart from '../../assets/heart.svg'
import star from '../../assets/star.svg'
import Image from 'next/image'

const ListingCard = ({ inventoryId, inventory }) => {
  let router = useRouter()

  const viewListingDetails = () => {
    router.push({ pathname: '/details', query: { id: inventoryId } })
  }
console.log(inventory)
  return (
    <div className={style.ListingCard} onClick={() => viewListingDetails()}>
      <div className={style.thumbnailWrapper}>
        <div className={style.thumbnailOverlay}>
          <div className={style.rarityTag}>Rare find</div>
          <div className={style.heartIcon}>
            <Image width={23} height={23} src={heart.src} alt='' />
          </div>
        </div>
        <Image
          width={500}
          height={480}
          src={inventory.image}
          className={style.thumbnail}
          alt=''
        />
      </div>
      <div className={style.content}>
        <div>
          <b>{inventory.properties.title}</b>
          <div className={style.rating}>
            <b>{inventory.properties.rating}</b>
            <Image src={star} width={15} height={15} />
          </div>
        </div>
        <p>{inventory.properties.subtitle}</p>
        <div>
          <b>${inventory.properties.pricePerNight}</b> night
          •<span className={style.underline}> $386 total</span>
        </div>
      </div>
    </div>
  )
}

export default ListingCard
