//
//  DetailPostViewController.swift
//  EpiReddit
//
//  Created by Rémi Faucheux on 03/07/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import UIKit
import Alamofire

class DetailPostViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    var post:Post!
    var comments = [Comment]()
    var isDownloading = false
    
    @IBOutlet weak var Tilte: UILabel!
    @IBOutlet weak var author: UILabel!
    @IBOutlet weak var commentLabel: UITextField!
    @IBOutlet weak var content: UITextView!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var commentButton: UIButton!
    
    @IBAction func postComment(_ sender: Any) {
        if (StateManager.isLoggedIn() && commentLabel.text != nil)
        {
            let parameters: Parameters = [
                "post_id" : post.id,
                "content" : commentLabel.text!,
                ]
            print(parameters)
            let headers: HTTPHeaders = [
                "Authorization": "Bearer " + StateManager.getJwtToken()
            ]
            let url = Constants.baseUrl + "comments/comment"
            Alamofire.request(url, method: .post, parameters: parameters, headers: headers)
                .responseJSON { response in
                    // check for errors
                    print(response)
                    guard response.result.error == nil && response.result.isSuccess else {
                        print("error")
                        return
                    }
                    self.commentLabel.text = nil
                    self.comments.removeAll()
                    self.loadComment()
                    self.tableView.reloadData()
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        loadComment()
        Tilte.text = post!.title
        author.text = post!.username
        if (!StateManager.isLoggedIn()){
            commentLabel.isEnabled = false
            commentButton.isEnabled = false
        }
        if (post!.content == nil || post!.content == ""){
            print(post!.link!)
            content.text = post!.link!
        }
        else {
            print(post!.content!)
            content.text = post!.content!
        }
        Tilte.sizeToFit()
        author.sizeToFit()
        self.content.isEditable = false
        self.content.dataDetectorTypes = UIDataDetectorTypes.link;
    }

    func loadComment() {
        isDownloading = true
        
        // Build URL
        var url = Constants.baseUrl + "comments/forPost"
        if (StateManager.isLoggedIn()) {
            url += "WithUserVotes"
        }
        url += "?post_id=\(post.id)"
        
        let headers: HTTPHeaders = [
            "Authorization": "Bearer " + StateManager.getJwtToken()
        ]
        
        Alamofire.request(url, headers: headers)
            .responseJSON { response in
                print(response)
                // check for errors
                guard response.result.error == nil && response.result.isSuccess else {
                    self.onCommentsDownloaded(ok: false, downloadedComments: [])
                    return
                }
                
                // Get JSON
                guard let json = response.result.value as? [[String: Any]] else {
                    self.onCommentsDownloaded(ok: false, downloadedComments: [])
                    return
                }
                
                self.onCommentsDownloaded(ok: true, downloadedComments: json)
        }
    }
    
    func onCommentsDownloaded(ok:Bool, downloadedComments: [[String: Any]]){
        isDownloading = false
        
        if (!ok) {
            print("Error while downloading comments")
            return
        }
        var count = comments.count
        // Add all posts
        tableView.beginUpdates()
        for com in downloadedComments {
            var upvoted:Bool = false
            var downvoted:Bool = false
            if (StateManager.isLoggedIn()) {
                upvoted = com["upvote"] as! Bool
                downvoted = com["downvote"] as! Bool
            }
            
            // Build post
            let newComment:Comment = Comment(id: com["id"] as! Int)
            
            if let content = com["content"] as? String {
                newComment.content = content
            }
            
            newComment.createdAt = Date.dateFromISOString(string: com["createdAt"] as! String)!
            newComment.upvotes = com["upvotes"] as! Int
            newComment.upvoted = upvoted
            newComment.downvoted = downvoted
            newComment.username = com["username"] as! String
            
            comments.append(newComment)
            tableView.insertRows(at: [IndexPath(row: count, section: 0)], with: UITableViewRowAnimation.bottom)
            count += 1
        }
        tableView.endUpdates()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return comments.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell:CommentTableViewCell = tableView.dequeueReusableCell(withIdentifier: "commentCell", for: indexPath) as! CommentTableViewCell
        
        // Else bind cell
        let currentComment = comments[indexPath.row]
        print(comments.count)
        cell.authorLabel?.text = currentComment.username
        if (currentComment.upvotes < 0){
            cell.upvoteLabel?.textColor = UIColor.red
        }
        else if (currentComment.upvotes > 0) {
            cell.upvoteLabel?.textColor = UIColor.green
        }
        else {
            cell.upvoteLabel?.textColor = UIColor.black
        }
        cell.upvoteLabel?.text = String(currentComment.upvotes)
        cell.contentLabel.isEditable = false
        cell.contentLabel.dataDetectorTypes = UIDataDetectorTypes.address
        cell.contentLabel.text = currentComment.content
        
        if (StateManager.isLoggedIn()){
            if (currentComment.downvoted){
                cell.upVoteButton?.tintColor = UIColor.blue
                cell.downVoteButton?.tintColor = UIColor.red
            }
            else if (currentComment.upvoted) {
                cell.upVoteButton?.tintColor = UIColor.red
                cell.downVoteButton?.tintColor = UIColor.blue
                
            }
            else {
                cell.upVoteButton?.tintColor = UIColor.blue
                cell.downVoteButton?.tintColor = UIColor.blue
            }
        } else {
            cell.upVoteButton?.isEnabled = false
            cell.downVoteButton?.isEnabled = false
        }
        
        
        
        // Displayable date
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        let dateString = formatter.string(from: currentComment.createdAt)
        cell.infoLabel?.text = "\(dateString)"
        
        // Votes actions
        cell.onUpvote = {
            if (StateManager.isLoggedIn())
            {
                let parameters: Parameters = [
                    "comment_id" : currentComment.id,
                    "upvote" : !currentComment.upvoted,
                    "downvote" : false
                ]
                print(parameters)
                let headers: HTTPHeaders = [
                    "Authorization": "Bearer " + StateManager.getJwtToken()
                ]
                let url = Constants.baseUrl + "votes/comment"
                Alamofire.request(url, method: .post, parameters: parameters, headers: headers)
                    .responseJSON { response in
                        // check for errors
                        print(response)
                        guard response.result.error == nil && response.result.isSuccess else {
                            print("error")
                            return
                        }
                        if (currentComment.downvoted){
                            print("downvoted")
                            currentComment.upvotes += 2
                            currentComment.upvoted = true
                            currentComment.downvoted = false
                        }
                        else if (currentComment.upvoted){
                            print("upvoted")
                            currentComment.upvotes -= 1
                            currentComment.upvoted = false
                        } else {
                            print("nothing")
                            currentComment.upvotes += 1
                            currentComment.upvoted = true
                        }
                        currentComment.downvoted = false
                        self.comments[indexPath.row] = currentComment
                        tableView.reloadRows(at: [indexPath], with: UITableViewRowAnimation.automatic)
                        tableView.reloadData()
                }
            }
        }
        
        cell.onDownvote = {
            if (StateManager.isLoggedIn())
            {
                let parameters: Parameters = [
                    "comment_id" : currentComment.id,
                    "upvote" : false,
                    "downvote" : !currentComment.downvoted
                ]
                let headers: HTTPHeaders = [
                    "Authorization": "Bearer " + StateManager.getJwtToken()
                ]
                let url = Constants.baseUrl + "votes/comment"
                Alamofire.request(url, method: .post, parameters: parameters, headers: headers)
                    .responseJSON { response in
                        // check for errors
                        print(response)
                        guard response.result.error == nil && response.result.isSuccess else {
                            print("error")
                            return
                        }
                        if (currentComment.upvoted){
                            currentComment.upvotes -= 2
                            currentComment.upvoted = false
                            currentComment.downvoted = true
                        }
                        else if (currentComment.downvoted){
                            currentComment.upvotes += 1
                            currentComment.downvoted = false
                        } else {
                            currentComment.upvotes -= 1
                            currentComment.downvoted = true
                        }
                        currentComment.upvoted = false
                        self.comments[indexPath.row] = currentComment
                        tableView.reloadRows(at: [indexPath], with: UITableViewRowAnimation.automatic)
                        tableView.reloadData()
                }
            }
        }
        
        return cell
    }

}
