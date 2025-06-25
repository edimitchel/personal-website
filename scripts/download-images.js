import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base URL for images
const BASE_URL = 'https://book.micheledighoffer.fr'

// Image paths from the scraped data
const imagePaths = [
  // STOFMA project
  '/static/images/projects/stofma/caption.png',
  '/static/images/projects/stofma/stofma-accueil.png',
  '/static/images/projects/stofma/stofma-mesachats.png',
  '/static/images/projects/stofma/stofma-vente.png',
  '/static/images/projects/stofma/stofma-menulateral.png',
  '/static/images/projects/stofma/stofma-utilisateur.png',
  '/static/images/projects/stofma/stofma-action-utilisateur.png',
  '/static/images/projects/stofma/stofma-roles.png',
  
  // RCA Store project
  '/static/images/projects/rcastore/caption.png',
  '/static/images/projects/rcastore/rcastore-accueil.png',
  '/static/images/projects/rcastore/rcastore-catalogue.png',
  '/static/images/projects/rcastore/rcastore-inscription.png',
  '/static/images/projects/rcastore/rcastore-commandes.png',
  '/static/images/projects/rcastore/rcastore-informations.png',
  
  // English Vocabulary project
  '/static/images/projects/voceng/caption.png',
  '/static/images/projects/voceng/voceng-revision.png',
  '/static/images/projects/voceng/voceng-test.png',
  '/static/images/projects/voceng/voceng-sessions.png',
  
  // Pic'take project
  '/static/images/projects/pictake/caption.png',
  '/static/images/projects/pictake/pictake-accueil.png',
  '/static/images/projects/pictake/pictake-general.png',
  '/static/images/projects/pictake/pictake-timeline.png',
  '/static/images/projects/pictake/pictake-ajout.png',
  
  // Save Your Links project
  '/static/images/projects/syl/caption.png',
  
  // Interface Client-Entreprise project
  '/static/images/projects/intclen/caption.png',
  '/static/images/projects/intclen/intclen-accueil.jpg',
  '/static/images/projects/intclen/intclen-accueilcommande.jpg',
  '/static/images/projects/intclen/intclen-commande.jpg',
  
  // Ulm Nord Alsace project
  '/static/images/projects/ulmalsace/caption.png',
  '/static/images/projects/ulmalsace/ulmna-accueil.jpg',
  '/static/images/projects/ulmalsace/ulmna-bapteme.jpg',
  '/static/images/projects/ulmalsace/ulmna-banderole.jpg',
  
  // Experiments image
  '/static/images/projects/experiments.png'
]

// Create directories if they don't exist
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath)
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }
}

// Download a single image
function downloadImage(imageUrl, localPath) {
    const projectName = path.parse(imageUrl).dir.split('/').pop()
    const folderPath = path.join(__dirname, '..', 'public', 'images', projectName, path.basename(imageUrl))
  return new Promise((resolve, reject) => {
    ensureDirectoryExists(folderPath)
    
    const file = fs.createWriteStream(folderPath)
    
    https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✅ Downloaded: ${path.basename(folderPath)}`)
          resolve()
        })
      } else {
        console.log(`❌ Failed to download ${imageUrl}: ${response.statusCode}`)
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${imageUrl}:`, err.message)
      reject(err)
    })
  })
}

// Main download function
async function downloadAllImages() {
  console.log('🚀 Starting image download...')
  
  const publicDir = path.join(__dirname, '..', 'public')
  let successCount = 0
  let failCount = 0
  
  for (const imagePath of imagePaths) {
    try {
      const imageUrl = BASE_URL + imagePath
      const localPath = path.join(publicDir, imagePath)
      
      await downloadImage(imageUrl, localPath)
      successCount++
    } catch (error) {
      failCount++
    }
  }
  
  console.log(`\n📊 Download Summary:`)
  console.log(`✅ Successfully downloaded: ${successCount} images`)
  console.log(`❌ Failed downloads: ${failCount} images`)
  console.log(`📁 Images saved to: ${publicDir}/images/projects/`)
}

// Run the script
downloadAllImages().catch(console.error)
