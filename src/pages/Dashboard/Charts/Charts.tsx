import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import ReadingPerformance from './analytics'
import DownloadAnalytics from './DownloadAnalytics'

export const ChartsAnalytics = () => {
  return (
    <Card>
        <div>
         <CardHeader>
        <CardTitle>Your Reading Analytics</CardTitle>
      </CardHeader>  
      <CardContent>

      {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Books Read</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Reading Hours</p>
            <p className="text-2xl font-bold">142</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Books Downloaded</p>
            <p className="text-2xl font-bold">18</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-500">Audiobooks</p>
            <p className="text-2xl font-bold">7</p>
          </div>
        </div> 

         
             <div className="flex">
      {/* Chart 1 */}
      <div className="fle">
        <ReadingPerformance />
      </div>

      {/* Chart 2 */}
      <div className=" ">
        <DownloadAnalytics />
      </div>
    </div>
        </CardContent>
        </div>
        
    </Card>
  )
}
