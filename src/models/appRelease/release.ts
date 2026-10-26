export interface appReleaseState {
  id: number
  version_name: string
  /** versionCode Android — yang dibandingkan app mobile */
  build_number: number
  release_notes: string | null
  file_name: string
  file_size: number
  /** relatif terhadap base URL API */
  download_path: string
  created_by: string | null
  created_by_name: string | null
  created_at: string
}

export interface appReleaseListProps {
  data: appReleaseState[]
  message: string
  status: string
}
