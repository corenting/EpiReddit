//
//  PostsListTableViewController.swift
//  EpiReddit
//
//  Created by Corentin Garcia on 29/06/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import UIKit
import Alamofire

class PostsListTableViewController: UITableViewController {

    @IBOutlet weak var categoryButton: UIButton!
    @IBOutlet weak var loginButton: UIButton!
    var dataRefreshControl = UIRefreshControl()
    @IBOutlet weak var createPostButton: UIBarButtonItem!
    
    var posts = [Post]()
    var categories = [Category]()
    var currentPage = 0
    var dontLoadMore = false // to stop lazy loading when not getting new posts
    var isDownloading = false // when a page is currently being downloaded
    var currentSelectedPost = 0
    
    var currentCategory = "frontpage"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Switch to frontpage and load other categories
        switchCategory(category: "frontpage")
        loadCategories()
        
        // Pull to refresh
        tableView.refreshControl = dataRefreshControl
        dataRefreshControl.addTarget(self, action: #selector(onPullToRefresh(_:)), for: .valueChanged)
    }

    override func viewDidAppear(_ animated: Bool) {
        // Set login button state
        if (!StateManager.isLoggedIn()){
            createPostButton.isEnabled = false
        } else {
            createPostButton.isEnabled = true
        }
        switchCategory(category: currentCategory)
        if (StateManager.isLoggedIn()) {
            loginButton.setTitle("Logout", for: UIControlState.normal)
        }
        else {
            loginButton.setTitle("Login", for: UIControlState.normal)
        }
    }
    
    @objc func onPullToRefresh(_ sender: Any) {
        switchCategory(category: currentCategory)
    }
    
    @IBAction func loginButtonClick(_ sender: Any) {
        if (!StateManager.isLoggedIn()) {
            performSegue(withIdentifier: "loginSegue", sender: self)
        }
        else {
            // Logout popup
            let alert = UIAlertController(title: "Logout", message: "Are you sure you want to logout?", preferredStyle: UIAlertControllerStyle.alert)
            
            let logoutAction = UIAlertAction(title: "Logout", style: .default) { (action:UIAlertAction) in
                StateManager.logout()
                self.loginButton.setTitle("Login", for: UIControlState.normal)
            }
            let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { (action:UIAlertAction) in }
            
            alert.addAction(logoutAction)
            alert.addAction(cancelAction)
            self.present(alert, animated: true, completion: nil)
        }
    }
    
    @IBAction func categoryButtonClick(_ sender: Any) {
        let alertController = UIAlertController(title: "Category", message: "Choose a category", preferredStyle: .actionSheet)
        
        for cat in categories {
            let action = UIAlertAction(title: cat.name.capitalized, style: .default) { (action:UIAlertAction) in
                self.switchCategory(category: cat.name)
            }
            alertController.addAction(action)
        }
        self.present(alertController, animated: true, completion: nil)
    }
    
    func switchCategory(category: String) {
        currentCategory = category
        categoryButton.setTitle(currentCategory.capitalized, for: UIControlState.normal)
        
        // Clear current data and reload
        removeAllPosts()
        loadData()
    }
    
    func removeAllPosts() {
        currentPage = 0
        posts.removeAll()
        tableView.reloadData()
    }
    
    func loadCategories() {
        // Build URL
        guard let url = URL(string: Constants.baseUrl + "categories") else {
            self.onCategoriesDownloaded(ok: false, downloadedCategories: [])
            return
        }
        
        Alamofire.request(url)
            .responseJSON { response in
                // check for errors
                guard response.result.error == nil && response.result.isSuccess else {
                    self.onCategoriesDownloaded(ok: false, downloadedCategories: [])
                    return
                }
                
                // Get JSON
                guard let json = response.result.value as? [[String: Any]] else {
                    self.onCategoriesDownloaded(ok: false, downloadedCategories: [])
                    return
                }
                
                self.onCategoriesDownloaded(ok: true, downloadedCategories: json)
        }
    }
    
    func onCategoriesDownloaded(ok:Bool, downloadedCategories: [[String: Any]]){
        // Clear existing category and add hardcoded frontpage category
        let frontPageCategory = Category(id: 0, name: "frontpage")
        categories.removeAll()
        categories.append(frontPageCategory)
        
        if (!ok) {
            print("Error while downloading categories")
            return;
        }
        
        // Add other categories if download was successful
        for newCat in downloadedCategories {
            categories.append(Category(id: newCat["id"] as! Int, name: newCat["name"] as! String))
        }
    }

    func loadData() {
        isDownloading = true
        
        // Build URL
        var url = Constants.baseUrl + "posts/list"
        if (StateManager.isLoggedIn()) {
            url += "WithUserVotes"
        }
        url += "?page=\(currentPage)&category=\(currentCategory)&sort=hot"
        
        let headers: HTTPHeaders = [
            "Authorization": "Bearer " + StateManager.getJwtToken()
        ]
        
        Alamofire.request(url, headers: headers)
            .responseJSON { response in
                // check for errors
                guard response.result.error == nil && response.result.isSuccess else {
                    self.onPostsDownloaded(ok: false, downloadedPosts: [])
                    return
                }
                
                // Get JSON
                guard let json = response.result.value as? [[String: Any]] else {
                    self.onPostsDownloaded(ok: false, downloadedPosts: [])
                    return
                }
                
                self.onPostsDownloaded(ok: true, downloadedPosts: json)
        }
    }
    
    func onPostsDownloaded(ok:Bool, downloadedPosts: [[String: Any]]){
        isDownloading = false
        self.dataRefreshControl.endRefreshing()
        
        if (!ok) {
            currentPage -= 1
            print("Error while downloading posts")
            return
        }
        
        // Don't add post and stop loading more if page was empty
        if (downloadedPosts.count == 0) {
            dontLoadMore = true;
            return
        }
        
        // Update counter, begin update
        self.currentPage += 1
        var count = posts.count
        
        // Add all posts
        tableView.beginUpdates()
        for post in downloadedPosts {
            var upvoted:Bool = false
            var downvoted:Bool = false
            if (StateManager.isLoggedIn()) {
                upvoted = post["upvote"] as! Bool
                downvoted = post["downvote"] as! Bool
            }
            
            // Build post
            let newPost:Post = Post(id: post["id"] as! Int)
            
            if let content = post["content"] as? String {
                newPost.content = content
            }
            if let link = post["link"] as? String {
                newPost.link = link
            }
            if let picture = post["picture"] as? String {
                newPost.picture = picture
            }
            newPost.createdAt = Date.dateFromISOString(string: post["createdAt"] as! String)!
            newPost.categoryName = post["categoryName"] as! String
            newPost.upvotes = post["upvotes"] as! Int
            newPost.upvoted = upvoted
            newPost.downvoted = downvoted
            newPost.username = post["username"] as! String
            newPost.title = post["title"] as! String
            
            posts.append(newPost)
            tableView.insertRows(at: [IndexPath(row: count, section: 0)], with: UITableViewRowAnimation.bottom)
            count += 1
        }
        tableView.endUpdates()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return posts.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell:PostTableViewCell = tableView.dequeueReusableCell(withIdentifier: "postCell", for: indexPath) as! PostTableViewCell

        // Load more posts if near the end
        if (indexPath.row + 10 >= self.posts.count && currentPage != 0 && !dontLoadMore && !isDownloading) {
            print("Lazy loading page \(currentPage)")
            loadData()
        }
        
        // Else bind cell
        let currentPost = posts[indexPath.row]
        cell.titleLabel.text = currentPost.title
        cell.authorLabel.text = currentPost.username
        if (currentPost.upvotes < 0){
            cell.ratingLabel.textColor = UIColor.red
        }
        else if (currentPost.upvotes > 0) {
            cell.ratingLabel.textColor = UIColor.green
        }
        else {
            cell.ratingLabel.textColor = UIColor.black
        }
        cell.ratingLabel.text = String(currentPost.upvotes)
        
        if (currentPost.downvoted){
            cell.upVoteButton.tintColor = UIColor.blue
            cell.downVoteButton.tintColor = UIColor.red
        }
        else if (currentPost.upvoted) {
            cell.upVoteButton.tintColor = UIColor.red
            cell.downVoteButton.tintColor = UIColor.blue

        }
        else {
            cell.upVoteButton.tintColor = UIColor.blue
            cell.downVoteButton.tintColor = UIColor.blue
        }
        if (!StateManager.isLoggedIn()){
            cell.upVoteButton.isEnabled = false
            cell.downVoteButton.isEnabled = false

        } else {
            cell.upVoteButton.isEnabled = true
            cell.downVoteButton.isEnabled = true
        }

        
        // Displayable date
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        let dateString = formatter.string(from: currentPost.createdAt)
        cell.infosLabel.text = "\(currentPost.categoryName) - \(dateString)"
        
        // Votes actions
        cell.onUpvote = {
            if (StateManager.isLoggedIn())
            {
                let parameters: Parameters = [
                    "post_id" : currentPost.id,
                    "upvote" : !currentPost.upvoted,
                    "downvote" : false
                ]
                print(parameters)
                let headers: HTTPHeaders = [
                    "Authorization": "Bearer " + StateManager.getJwtToken()
                ]
                let url = Constants.baseUrl + "votes/post"
                Alamofire.request(url, method: .post, parameters: parameters, headers: headers)
                    .responseJSON { response in
                    // check for errors
                    print(response)
                    guard response.result.error == nil && response.result.isSuccess else {
                        print("error")
                        return
                    }
                    if (currentPost.downvoted){
                        print("downvoted")
                        currentPost.upvotes += 2
                        currentPost.upvoted = true
                        currentPost.downvoted = false
                    }
                    else if (currentPost.upvoted){
                        print("upvoted")
                        currentPost.upvotes -= 1
                        currentPost.upvoted = false
                    } else {
                        print("nothing")
                        currentPost.upvotes += 1
                        currentPost.upvoted = true
                    }
                    currentPost.downvoted = false
                    self.posts[indexPath.row] = currentPost
                    tableView.reloadRows(at: [indexPath], with: UITableViewRowAnimation.automatic)
                    tableView.reloadData()
                }
            }
        }
        
        cell.onDownvote = {
            if (StateManager.isLoggedIn())
            {
                let parameters: Parameters = [
                    "post_id" : currentPost.id,
                    "upvote" : false,
                    "downvote" : !currentPost.downvoted
                    ]
                let headers: HTTPHeaders = [
                    "Authorization": "Bearer " + StateManager.getJwtToken()
                ]
                let url = Constants.baseUrl + "votes/post"
                Alamofire.request(url, method: .post, parameters: parameters, headers: headers)
                    .responseJSON { response in
                        // check for errors
                        print(response)
                        guard response.result.error == nil && response.result.isSuccess else {
                            print("error")
                            return
                        }
                        if (currentPost.upvoted){
                            currentPost.upvotes -= 2
                            currentPost.upvoted = false
                            currentPost.downvoted = true
                        }
                        else if (currentPost.downvoted){
                            currentPost.upvotes += 1
                            currentPost.downvoted = false
                        } else {
                            currentPost.upvotes -= 1
                            currentPost.downvoted = true
                        }
                        currentPost.upvoted = false
                        self.posts[indexPath.row] = currentPost
                        tableView.reloadRows(at: [indexPath], with: UITableViewRowAnimation.automatic)
                        tableView.reloadData()
                }
            }
        }
            
        return cell
    }
    
    @IBAction func addPost(_ sender: Any) {
        if (StateManager.isLoggedIn()) {
            performSegue(withIdentifier: "CreatePost", sender: self)
        }
    }
    
     override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        currentSelectedPost = indexPath.row

        performSegue(withIdentifier: "detailPost", sender: self)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "detailPost" {
            if let destinationVC = segue.destination as? DetailPostViewController {
                destinationVC.post = posts[currentSelectedPost]
            }
        }
        if segue.identifier == "CreatePost" {
            if let destinationVC = segue.destination as? CreatePostViewController {
                destinationVC.categories = categories
            }
        }
    }
}
