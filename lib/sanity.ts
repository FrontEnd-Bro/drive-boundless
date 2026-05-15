import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN || ''}`,
      },
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Failed to upload image to Sanity')
  }

  const data = await response.json()
  return data.document.url
}
